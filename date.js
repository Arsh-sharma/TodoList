module.exports = getDate;

function getDate(){
    var today = new Date();
    var options = {
        weekday: "long",
        day: "numeric",
        month: "long",
};

    var day = today.toLocaleDateString("en-US",options);

    return day;
}
// var day = "";
// if(today.getDay()===0){
//     day ="Sunday";
//     // res.send("Yay it's a weekend");
// }else if(today.getDay()===1){
//     day = "Monday";
//     // res.send("Booooooo");
// }
// else if(today.getDay()===2){
//     day = "Tuesday";
//     // res.send("Booooooo");
// }
// else if(today.getDay()===3){
//     day = "Wednesday";
//     // res.send("Booooooo");
// }
// else if(today.getDay()===4){
//     day = "Thursday";
//     // res.send("Booooooo");
// }
// else if(today.getDay()===5){
//     day = "Friday";
//     // res.send("Booooooo");
// }
// else if(today.getDay()===6){
//     day = "Saturday";
//     // res.send("Booooooo");
// }
// else{
//     console.log("Error: current day is equal to: "+today.getDay());
// }


