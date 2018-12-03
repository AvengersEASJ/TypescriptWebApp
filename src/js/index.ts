import axios, {
    AxiosResponse,
    AxiosError} from "../../node_modules/axios";

//URI
//Husk at ændre denne til den oprigtige Webservice når den er klar.
let webserviceUri: string = "https://resttamagotchiservice.azurewebsites.net/api/"

//Interfaces
//Husk ingen uppercases! Why? NOBODY KNOWS

interface ITask{
    id: number
    tamagotchiID: number
    taskName: string
    taskReward: number
}

interface IUser{
    id: number
    userName: string
    password: string
}

interface IFriend{
    id: number
    userID: number
    friendName: string
    gender: boolean
    mood: number
    hunger: number
    boredom: number
}

//Variabler
let userIDfromName: number;

//Inputs
let loginUsernameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("loginUserNameInput")
let loginPasswordInput: HTMLInputElement = <HTMLInputElement>document.getElementById("loginPasswordInput")

let taskUsernameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskUserNameInput")
let taskFriendnameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskFriendNameInput")
let taskNameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskName")

//Outputs
let allTasksOutput: HTMLDivElement = <HTMLDivElement>document.getElementById("taskListOutput");

//Selecters(Dropdowns)
let taskRewards: HTMLSelectElement = <HTMLSelectElement>document.getElementById("taskRewards");

//Buttons
let LoginButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("LoginButton");
LoginButtonElement.onclick = CheckLogin;

let HentTaskListeButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("loadTaskButton");
HentTaskListeButtonElement.onclick = GetAllTasks;

let OpretTaskButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("createTaskButton");
OpretTaskButtonElement.onclick = PostTask;

//Functions

//User functions

//Check om Username og Password matcher.
function CheckLogin(): void{
    axios.get<IUser[]>(webserviceUri + "User")
    .then(function (response: AxiosResponse<IUser[]>): void {
        let loginUsername = loginUsernameInput.value;
        let loginPassword = loginPasswordInput.value;
        let loginNotFound: Boolean = true;

        response.data.forEach((user: IUser) => {
            if(user.userName == loginUsername && user.password == loginPassword){
                loginNotFound = false;
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



//TaskFunctions

//Hent alle Tasks
function GetAllTasks(): void{
    axios.get<ITask[]>(webserviceUri + "Task")
    .then(function (response: AxiosResponse<ITask[]>): void {
        let result: string = "<ol>";
        response.data.forEach((task: ITask) => {
            
            result += 
            "<li>" 
            + "Task ID: " + task.id + "<br>"
            + "Tamagotchi ID: " + task.tamagotchiID + "<br>"
            + "Task: " + task.taskName + "<br>"
            + "Task Reward: " + task.taskReward
            +"</li>";
            
        });
        result += "</ol>";
        allTasksOutput.innerHTML = result;
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
function PostTask(){


    //Variabler bliver sat til input values.
    let newTaskUsername: number =+ taskUsernameInput.value;
    let newTaskTamagotchiName: number =+ taskFriendnameInput.value
    let newTask: string = taskNameInput.value;
    let newTaskReward: number = taskRewards.options.selectedIndex
    
    //Tasken bliver oprettet.
    axios.post<ITask>(webserviceUri + "Task", 
    {id: newTaskUsername, tamagotchiID: newTaskTamagotchiName, taskName: newTask, taskReward: newTaskReward})
    .then((response: AxiosResponse) => { console.log("response " + response.status + " " + 
    response.statusText); })
    .catch((error: AxiosError) => { console.log(error); });
    
}

//Slet Tasks



//Slet alle Tasks

