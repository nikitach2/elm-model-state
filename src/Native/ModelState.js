var _user$project$Native_ModelState = function() {

  var saves = [];
  var currentModelState;
  var isLoadModelState = false;
  var modelStateToLoad;
  
  _elm_lang$core$Native_Utils.update = function (oldRecord,updatedFields){
    if (isLoadModelState) { 
      isLoadModelState = false;
      return modelStateToLoad
    } 
    else {
      var newRecord = {};
      for (var key in oldRecord)
        newRecord[key] = oldRecord[key];
      for (var key in updatedFields)
        newRecord[key] = updatedFields[key];
      currentModelState = newRecord;
      return newRecord;
    }
  }
  
  var save = F2(
    function (saveName,savesLocation){
      console.log(saveName);
      console.log(savesLocation);
      return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
        const newSave = 
          { name : saveName 
          , data : currentModelState
          }
        if (savesLocation.ctor == "App"){
          //remove conflicts
          for (let i = 0; i < saves.length; i++) {
            const save = saves[i];
            if (save.name == saveName) {
              saves.splice(i,1);
              i--;
            }
          }
          //add new save
          saves.push(newSave);
          callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
        }
        else if (savesLocation.ctor == "LocalStorage"){
          const str_currentModelState = JSON.stringify(currentModelState);
          localStorage.setItem(saveName, str_currentModelState);
          callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
        }
        else {
          console.error("savesLocation misspeled");
        }
      });
    }
  );
  
  var load = F2(
    function (saveName,savesLocation){
      return _elm_lang$core$Native_Scheduler.nativeBinding(function(callback){
        console.log(saveName);
        console.log(savesLocation);
        if (savesLocation.ctor == "App"){
          for (let i = 0; i < saves.length; i++) {
            const save = saves[i];
            if (save.name == saveName){
              modelStateToLoad = save.data
              isLoadModelState = true;
              callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
              return;
            }
          }
          callback(_elm_lang$core$Native_Scheduler.fail("Save with name '"+saveName+"' does not exist"));
        }
        else if (savesLocation.ctor == "LocalStorage"){
          const save = localStorage.getItem(saveName);
          var save_object;
          try {
            save_object = JSON.parse(save);
          } catch(e) {
            console.error("Failed to load model state. Model state is corrupted");
            return;
          }
          modelStateToLoad = save_object;
          isLoadModelState = true;
          callback(_elm_lang$core$Native_Scheduler.succeed(_elm_lang$core$Native_Utils.Tuple0));
        }
        else {
          console.error("savesLocation misspeled");
        }
      });
    }
  );
  
  return {
    save : save ,
    load : load,
  };
  }();