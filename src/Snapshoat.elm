module Snapshoat exposing (saveModel)

import Native.Snapshoat 
import Task

saveModel : (() -> msg) -> Cmd msg
saveModel msg =
  let
    task_saveModel : Task.Task Never ()
    task_saveModel =
      Native.Snapshoat.saveModel
  in
  Task.perform msg task_saveModel
