//Instancia de socket.io del lado del cliente 
const socket = io(); 

//Variable usuario: 
let user; 
const chatBox = document.getElementById("chatBox");

Swal.fire({
    title: "Identificate", 
    input: "text",
    text: "Ingresa un usuario para identificarte en el chat", 
    inputValidator: (value) => {
        return !value && "Necesitas un nombre para ingresar al chat"
    }, 
    allowOutsideClick: false,
}).then( result => {
    user = result.value;
})


chatBox.addEventListener("keyup", (event) => {
    if(event.key === "Enter") {
        if(chatBox.value.trim().length > 0) { 
            socket.emit("message", {user: user, message: chatBox.value}); 
            console.log("el usuario es:"+user)
            chatBox.value = "";
        }
    }
})

//Escuchar mensajes: 

socket.on("message", data => {
    let log = document.getElementById("messagesLogs");
    let messages = "";

    data.forEach( message => {
        messages = messages + `${message.user} dice: ${message.message} <br>`
    })

    log.innerHTML = messages;
})