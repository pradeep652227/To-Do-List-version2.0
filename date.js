module.exports=getDate;

function getDate(){
    let today = new Date();
    let options = { weekday: "long", month: "short", day: "numeric" };
    date = today.toLocaleDateString("en-US", options);
    return date;
}