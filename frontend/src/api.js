
const API=import.meta.env.VITE_API_URL||"http://127.0.0.1:8000/api";

async function request(path,opts={},retry=true){
  const token=localStorage.getItem("medlog_access");
  const headers={...(opts.headers||{})};

  if(!(opts.body instanceof FormData)){
    headers["Content-Type"]="application/json";
  }

  if(token){
    headers.Authorization=`Bearer ${token}`;
  }

  const r=await fetch(API+path,{...opts,headers});
  const t=await r.text();

  let d={};
  try{
    d=t?JSON.parse(t):{};
  }catch{
    d={detail:t};
  }

  if(r.status===401 && retry && localStorage.getItem("medlog_refresh")){
    const refreshed=await refreshToken();

    if(refreshed){
      return request(path,opts,false);
    }

    localStorage.removeItem("medlog_access");
    localStorage.removeItem("medlog_refresh");
    localStorage.removeItem("medlog_user");
  }

  if(!r.ok){
    throw Error(d.detail||"Request failed");
  }

  return d;
}

async function refreshToken(){
  const refresh=localStorage.getItem("medlog_refresh");

  if(!refresh){
    return false;
  }

  try{
    const r=await fetch(`${API}/auth/token/refresh/`,{
      method:"POST",
      headers:{
        "Content-Type":"application/json"
      },
      body:JSON.stringify({refresh})
    });

    if(!r.ok){
      return false;
    }

    const d=await r.json();

    localStorage.setItem("medlog_access",d.access);

    if(d.refresh){
      localStorage.setItem("medlog_refresh",d.refresh);
    }

    return true;
  }catch{
    return false;
  }
}

export async function api(path,opts={}){
  return request(path,opts,true);
}

export async function login(username,password){
  const d=await api("/auth/login/",{
    method:"POST",
    body:JSON.stringify({username,password})
  });

  localStorage.setItem("medlog_access",d.access);
  localStorage.setItem("medlog_refresh",d.refresh);
  localStorage.setItem("medlog_user",JSON.stringify(d.user));

  return d;
}
