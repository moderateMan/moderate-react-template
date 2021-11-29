import React, { Component,memo,useEffect,useState } from "react";

export default (()=>{
    useEffect(()=>{
        window.g_microAppsStart();
    },[])
    return <div key="sub-View"  id="sub-View">
    </div>
})
