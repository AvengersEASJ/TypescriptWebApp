import axios, {
    AxiosResponse,
    AxiosError} from "../../node_modules/axios";

//URI
//Husk at ændre denne til den oprigtige Webservice når den er klar.
//let webserviceUri: string = "https://localhost:44300/api/"
let webserviceUri: string = "https://ifriendwebservice.azurewebsites.net/api/"


//Interfaces
//Husk ingen uppercases! Why? NOBODY KNOWS

interface ITask{
    taskId: number
    friendId: number
    taskName: string
    taskDesc: string
}

interface IUser{
    userId: number
    username: string
    userPassword: string
}

interface IFriend{
    friendsId: number
    friendsName: string
    gender: boolean
    thirst: number
    hunger: number
    task: number
    fun: number
    dress: number
    ownerId: number
}

//Variabler

//Inputs
let loginUsernameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("loginUserNameInput")
let loginPasswordInput: HTMLInputElement = <HTMLInputElement>document.getElementById("loginPasswordInput")

let IFriendNameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("IFriendNameInput")
let releaseFriendInput: HTMLInputElement = <HTMLInputElement>document.getElementById("releaseIfriendNameInput")

let taskTitelInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskTitelInput")
let taskFriendnameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskFriendNameInput")
let taskDescInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskDescInput")
let loadTaskFriendnameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("loadTaskFriendNameInput")
let deleteTaskIdInput: HTMLInputElement = <HTMLInputElement>document.getElementById("deleteTaskidInput")


//Selecters(Dropdowns)
let IFriendGenderSelector: HTMLSelectElement = <HTMLSelectElement>document.getElementById("IFriendGenderSelect")
let taskRewards: HTMLSelectElement = <HTMLSelectElement>document.getElementById("taskRewards");

//Buttons
window.onload = function(){ 
    
//UserButtons
let LoginButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("LoginButton");
if(LoginButtonElement != null){
    LoginButtonElement.addEventListener("click", CheckLogin);
}

//IFriend Buttons
let CreateIFriendButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("createIFriendButton");
if(CreateIFriendButtonElement != null){
    CreateIFriendButtonElement.addEventListener("click", createIFriend);
}

let LoadIFriendButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("loadButton");
if(LoadIFriendButtonElement != null){
    LoadIFriendButtonElement.addEventListener("click", GetAllIFriends);
}

let ReleaseIFriendButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("releaseFriendButton");
if(ReleaseIFriendButtonElement != null){
   ReleaseIFriendButtonElement.addEventListener("click", deleteIfriend);
}

//Task Buttons
let OpretTaskButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("createTaskButton");
if(OpretTaskButtonElement != null){
    OpretTaskButtonElement.addEventListener("click", CreateTasks)
}

let HentTaskListeButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("loadTaskButton");
if(HentTaskListeButtonElement != null){
    HentTaskListeButtonElement.addEventListener("click", GetIFriendTasks)
}

let DeleteTaskButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("deleteTaskButton");
if(DeleteTaskButtonElement != null){
    DeleteTaskButtonElement.addEventListener("click", deleteTask)
}


};
//If statements

//Storage

//Outputs
let allTasksOutput: HTMLDivElement = <HTMLDivElement>document.getElementById("taskListOutput");
let allIfriendsOutput: HTMLDivElement = <HTMLDivElement>document.getElementById("statBlock")

//Functions

//Test Functions
function TestButton(){
    alert("Button works: " + sessionStorage.getItem("UserID"));
}

//User functions

//Check om Username og Password matcher.
function CheckLogin(): void{
    axios.get<IUser[]>(webserviceUri + "Users")
    .then(function (response: AxiosResponse<IUser[]>): void {
        let loginUsername = loginUsernameInput.value;
        let loginPassword = loginPasswordInput.value;
        let loginUserId: number = 0;
        let loginNotFound: Boolean = true;

        response.data.forEach((user: IUser) => {
            if(user.username == loginUsername && user.userPassword == loginPassword){
                loginNotFound = false;
                loginUserId =+ user.userId;
                sessionStorage.setItem("UserID", String(loginUserId));
                sessionStorage.setItem("UserName", user.username)
                window.location.href = "https://tamagotchiwebapp.azurewebsites.net/createTama.htm";

            }
            
        });
        if (loginNotFound)
        alert("Username and Password does not match!\nTIP: Both username and password is case sensitive!")
    })
    .catch(function (error: AxiosError): void { 
        if (error.response) {
            alert(error);
        } else {
            alert(error);
        }
    });
}

//IFriend Functions

//Skaffer FriendID ud fra IFriend navn.
function GetFriendID(ifriendname: string): void{
    //let TaskedIFriendName = taskFriendnameInput.value;
    axios.get<IFriend>(webserviceUri + "Friends")
    .then(function (response: AxiosResponse<IFriend[]>): void{
        response.data.forEach((Ifriend: IFriend) => {
            if(Ifriend.friendsName == ifriendname){
                sessionStorage.setItem("FriendID", String(Ifriend.friendsId));
            }
            else{
            }
        });
        
    })
    
}

//Bygger en IFriend
function createIFriend(): void{
    let IFriendName = IFriendNameInput.value;
    let IFriendGender: Boolean;
    
    if(IFriendGenderSelector.selectedIndex == 0){
        IFriendGender = true;
    }
    else if(IFriendGenderSelector.selectedIndex == 1){
        IFriendGender = false;
    }

    axios.post<IFriend>(webserviceUri + "Friends", {ownerId: parseInt(sessionStorage.getItem("UserID")), 
    friendsName: IFriendName, gender: IFriendGender})
    .then((response: AxiosResponse) => { console.log("response " + response.status + " " + response.statusText); })
        .catch((error: AxiosError) => { console.log(error); });

}

//Henter alle IFriends under den online bruger(Skal der kun være en?)
function GetAllIFriends(): void{
    let FriendFound: boolean = false;

    axios.get<IFriend[]>(webserviceUri + "Friends")
    .then(function (response: AxiosResponse<IFriend[]>): void {
        let ifriendgenderoutput: string;
        let result: string = "<ul>";
        response.data.forEach((friend: IFriend) => {
            if(friend.ownerId == parseInt(sessionStorage.getItem("UserID"))){
            if(friend.gender == true){
                ifriendgenderoutput = "Male";
            }
            else{
                ifriendgenderoutput = "Female";
            }
            FriendFound = true;
            result += 
            "<li>" 
            + "Friend name: " + friend.friendsName + "<br>"
            + "Gender: " + ifriendgenderoutput + "<br>"
            + "Hunger: " + friend.hunger + "<br>"
            + "Thirst: " + friend.thirst + "<br>"
            + "Fun: " + friend.fun + "<br>"
            + "Task points: " + friend.task + "<br>"
            + "</li>";
            }
            
        });
        if(FriendFound){
        result += "</ul><br>";
        allIfriendsOutput.innerHTML = result;
        }
        else{

        }
        
    })
    .catch(function (error: AxiosError): void { 
        if (error.response) {
            allIfriendsOutput.innerHTML = error;
        } else {
            allIfriendsOutput.innerHTML = error;
        }
    });
}

//Slet en bestemt IFriend
function deleteIfriend(): void {  
    GetFriendID(releaseFriendInput.value);
    axios.delete<IFriend>(webserviceUri + "Friends/" + sessionStorage.getItem("FriendID"))
        .then(function (response: AxiosResponse<IFriend>): void {
            location.reload(true);
        })
        .catch(function (error: AxiosError): void { 
            if (error.response) {
               
            } else {
             
            }
        });
}

//TaskFunctions

//Hent alle Tasks
function GetIFriendTasks(): void{
    GetFriendID(loadTaskFriendnameInput.value)
    let FriendFound: boolean = false;

    axios.get<ITask[]>(webserviceUri + "Tasks")
    .then(function (response: AxiosResponse<ITask[]>): void {
        let result: string = "<ul>";
        response.data.forEach((task: ITask) => {
            if(task.friendId == parseInt(sessionStorage.getItem("FriendID"))){
            FriendFound = true;
            result += 
            "<li>" 
            + "Task ID: " + task.taskId + "<br>"
            + "Task Titel: " + task.taskName + "<br>"
            + "Task Description: " + task.taskDesc
            +"</li>";
            }
            
        });
        if(FriendFound){
        result += "</ul><br>";
        allTasksOutput.innerHTML = result;
        }
        else{

        }
        
    })
    .catch(function (error: AxiosError): void { 
        if (error.response) {
            allTasksOutput.innerHTML = error;
        } else {
            allTasksOutput.innerHTML = error;
        }
    });
}

//Opret Tasks
function CreateTasks(){


    //Variabler bliver sat til input values
    GetFriendID(taskFriendnameInput.value);
    let newTaskTitel: string = taskTitelInput.value;
    let newTaskDesc: string = taskDescInput.value;
    
    //Tasken bliver oprettet.
    axios.post<ITask>(webserviceUri + "Tasks", 
    {friendId: parseInt(sessionStorage.getItem("FriendID")), taskName: newTaskTitel, taskDesc: newTaskDesc})
    .then((response: AxiosResponse) => { console.log("response " + response.status + " " + 
    response.statusText); })
    .catch((error: AxiosError) => { console.log(error); });
    
}

//Slet Tasks
function deleteTask(): void {  
    axios.delete<ITask>(webserviceUri + "Tasks/" + deleteTaskIdInput.value)
        .then(function (response: AxiosResponse<ITask>): void {
            location.reload(true);
        })
        .catch(function (error: AxiosError): void { 
            if (error.response) {
               
            } else {
             
            }
        });
}


//Slet alle Tasks

