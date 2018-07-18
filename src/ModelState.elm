module ModelState exposing (..)

{-| 
This library allow to save & load state of an elm app (model). 

WARINING!!! Any commands from `loadFromApp` or `loadFromLocalStorage` will take effect only after update function will return changed model. 
Be sure that you change model to new one in update function after loading a save or there will be unexpected behaviours.

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            GetLoadResult result ->
                case result of
                    Ok () ->
                        --Ok!
                        { model | field = model.field } ! [] 
                        --Not Ok! 
                        model ! []                           
                    Err msg -> 
                        model ! []

# Definitions
@docs SaveName
@docs SavesLocation
# Save & Load
@docs save
@docs load
-}
import Native.ModelState 
import Task
{-| 
-}
type alias SaveName =
    String
{-| 
Saves stored in `App` will exist only during apps runtime.

Saves stored in `LocalStorage` will be saved in browser local storage and will exist until will be cleared manualy.

!!!WARNING!!! 
Saves in `LocalStorage` must reprsent model structure from which saves there created. If model represent different structure then where will be errors

-}
type SavesLocation 
    = App 
    | LocalStorage
{-| 
Creates save, of model state, with specified `SaveName` and `SaveLocation`.

    update msg model =
        case msg of 
            GetNothing () ->
                model ! []
            WhateverMsg ->
                model ! [ ModelState.saveInApp "save1" App GetNothing ]
-}
save 
    : SaveName 
    -> SavesLocation 
    -> (() -> msg) 
    -> Cmd msg
save saveName savesLocation msg = 
    let
        task_save : Task.Task Never ()
        task_save =
            Native.ModelState.save saveName savesLocation
    in
    Task.perform msg task_save
{-| 
Loads model state, from save, stored in `App` or `LocalStorage`

If save with specified `SaveName` does not exist then nothing will be loaded and Result will return error msg

    update : Msg -> Model -> ( Model, Cmd Msg )
    update msg model =
        case msg of
            GetLoadResult result ->
                case result of
                    Ok () ->
                        model ! []                           --Not Ok!
                        { model | field = model.field } ! [] --Ok!
                    Err msg -> 
                        model ! []
            loadModelState ->
                model ! [ ModelState.load "save1" GetLoadResult ]
-}
load 
    : SaveName 
    -> SavesLocation 
    -> (Result x a -> msg) 
    -> Cmd msg
load saveName savesLocation msg = 
    let
        task_load : Task.Task x a
        task_load = 
            Native.ModelState.load saveName savesLocation
    in
    Task.attempt msg task_load