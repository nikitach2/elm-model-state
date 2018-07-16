var _user$project$Native_Snapshoat = function() {

var savedModel;
var isLoadSavedModel = true;

_elm_lang$core$Native_Utils.update = function (oldRecord,updatedFields){
  var newRecord = {};
  
  if (isLoadSavedModel) { 
    isLoadSavedModel = false;
    const storedItem = localStorage.getItem("model")
    oldRecord = JSON.parse(storedItem);
  } 

  for (var key in oldRecord)
  {
    newRecord[key] = oldRecord[key];
  }
  for (var key in updatedFields)
  {
    newRecord[key] = updatedFields[key];
  }
  savedModel = newRecord;
  return newRecord;
}

var saveModel = _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
  const string = JSON.stringify(savedModel);
  localStorage.setItem("model", string); 
	callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
});

return {
  saveModel: saveModel
};

}();