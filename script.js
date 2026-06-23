console.log("script loaded");

const supabaseUrl = "https://vfocwywoupizsfetubzk.supabase.co";
const supabaseKey = "sb_publishable_lqQbe0mELE1iBzwUkOeGvA_nCEJZ7IS";

const supabaseClient = window.supabase.createClient(
    supabaseUrl,
    supabaseKey
);

const params = new URLSearchParams(window.location.search);

const room = 
    params.get ("room") || "default";

console.log("room:", room);

let lastUser = "相手";


let note = [];


async function addMessage(user,text){

   const { error } =
       await supabaseClient
          .from("messages")
          .insert([
            {
                user: user,
                text: text,
                room: room,

                time:

                new Date()
                .toLocaleTimeString(
                    "ja-JP",
                    {
                        hour:"2-digit",
                        minute:"2-digit"
                    }
                )
            }
          ]);
        
console.log("保存結果:", error);
  

}



const input = document.getElementById("messageInput");
const button = document.getElementById("sendButton");
const messages = document.getElementById("messages");
const replyButton = document.getElementById("replyButton");
const replyInput = document.getElementById("replyInput");
const loginButton = 
document.getElementById("loginButton");
const logoutButton = 
document.getElementById("logoutButton")

const copyRoomButton = 
document.getElementById(
    "copyRoomButton"
);

const createRoomButton =
document.getElementById(
    "createRoomButton"
);

const userNameInput = 
document.getElementById("userName");

let currentUser = "";

const saveUser = 
localStorage.getItem(
    "user"
);

if(saveUser){


    currentUser = 
    saveUser;

    userNameInput.value = 
    saveUser;
}

loginButton.addEventListener(
    "click",

    function(){

        currentUser = 
        userNameInput.value;


        if(currentUser ===""){

            alert("名前を入力してください");

            return;
        }

         localStorage.setItem(
            "user",
            currentUser
        );

        alert(
            currentUser + 
            "でログインしました"
        );

    }
);

logoutButton.addEventListener(

    "click",

    function(){

        localStorage.removeItem(
            "user"
        );

        currentUser = "";

        userNameInput.value = "";

        alert(
            "ログアウトしました"
        );
    }
);

copyRoomButton.addEventListener(

    "click",

    async function(){

        const url =

        window.location.origin
        +
        "/?room="
        +
        room;

        await navigator.clipboard
        .writeText(
            url
        );

        alert(
            "招待リンクをコピーしました"
        );
    }
);

createRoomButton.addEventListener(

    "click",

    function(){
    
    const newRoom =
    
    Math.random()
    .toString(36)
    .slice(2,8);

    window.location.href =

    window.location.origin
    +
    "/?room="
    +
    newRoom;

    }
);

function displayMessages(){

    messages.innerHTML = "";

    for (let i = 0; i < note.length; i++){

        const message = document.createElement("div");

        if(
            note[i].user
            ===
            currentUser
        ){

            message.className =
            "message mine";

        }
        else{

            message.className =
            "message other";
        }

       message.innerHTML =

       "<small>"

       +

       " "
    
       +

       (note[i].time || "")

       +

       "<small><br>"

       +

       note[i].text;


        messages.appendChild(message);          
    }
}


button.addEventListener("click", async function () {
    if (lastUser === "あなた"){
        alert("相手の返信待ちです");
        return;

    } 

    const text = input.value;

    if (text === "") {
        alert("メッセージを入力してください");
        return;
    }

  if(currentUser===""){

    alert("ログインしてください");

    return;

  }

  await addMessage(
    currentUser,
    text
  );
    lastUser = "あなた";

    input.value = "";
});

replyButton.addEventListener("click", async function() {

  
    const text = replyInput.value;

    if(text === ""){
        alert("相手のメッセージを入力してください");
        return;

    }

    if(currentUser ===""){

        alert("ログインしてください");

        return;
    }

    await addMessage(currentUser,text);

    replyInput.value = "";

});


console.log(supabaseClient);

async function loadMessages() {

    const { data, error } =
        await supabaseClient
            .from("messages")
            .select("*")
            .eq("room",room)
            .order("id");

    if(error){
        console.log(error);
        return;
    }        

    note = data;

    displayMessages();
}

loadMessages();    

supabaseClient
.channel("messages-channel")

.on(
    "postgres_changes",
    {
        event: "INSERT",
        schema: "public",
        table: "messages"
    },

    async (payload) => {
       
        console.log("Realtime受信:", payload);

if(
    payload.new.room
    ===
    room
){

await loadMessages();

}

    }
    
)
.subscribe((status) => {

    console.log("Realtime:", status);

}
);


