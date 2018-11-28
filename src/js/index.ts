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

//Inputs
let taskUsernameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskUserNameInput")
let taskFriendnameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskFriendNameInput")
let taskNameInput: HTMLInputElement = <HTMLInputElement>document.getElementById("taskName")

//Outputs
let allTasksOutput: HTMLDivElement = <HTMLDivElement>document.getElementById("taskListOutput");

//Selecters(Dropdowns)
let taskRewards: HTMLSelectElement = <HTMLSelectElement>document.getElementById("taskRewards");

//Buttons
let HentTaskListeButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("loadTaskButton");
HentTaskListeButtonElement.onclick = GetAllTasks;

let OpretTaskButtonElement: HTMLButtonElement = <HTMLButtonElement>document.getElementById("createTaskButton");
OpretTaskButtonElement.onclick = PostTask;

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
    let newTaskUsername: number =+ taskUsernameInput.value
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

