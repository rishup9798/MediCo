
import React,{useEffect,useState} from "react";
import {motion} from "framer-motion";
import {Activity,BrainCircuit,CalendarDays,FileText,HeartPulse,LogOut,Pill,Plus,ShieldCheck,Sparkles,Stethoscope,Upload,X} from "lucide-react";
import {AreaChart,Area,CartesianGrid,XAxis,YAxis,Tooltip,ResponsiveContainer} from "recharts";
import {api,login} from "./api";

const today=new Date().toISOString().slice(0,10);

const endpoints={
  symptoms:"/health/symptoms/",
  medications:"/health/medications/",
  lifestyle:"/health/lifestyle/",
  labs:"/health/labs/"
};

function Auth({done}){
  const [mode,setMode]=useState("login");
  const [f,setF]=useState({username:"",email:"",password:""});
  const [e,setE]=useState("");

  async function submit(x){
    x.preventDefault();
    setE("");
    try{
      if(mode==="register"){
        await api("/auth/register/",{
          method:"POST",
          body:JSON.stringify(f)
        });
      }
      await login(f.username,f.password);
      done();
    }catch(x){
      setE(x.message);
    }
  }

  return <div className="auth">
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="authbox">
      <Brand/>
      <h1>{mode==="login"?"Welcome back":"Create your health journal"}</h1>
      <p className="muted">Track symptoms, medicines, lifestyle and reports in one place.</p>
      <form onSubmit={submit}>
        <input
          placeholder="Username"
          required
          value={f.username}
          onChange={x=>setF({...f,username:x.target.value})}
        />
        {mode==="register"&&
          <input
            type="email"
            placeholder="Email"
            value={f.email}
            onChange={x=>setF({...f,email:x.target.value})}
          />
        }
        <input
          type="password"
          placeholder="Password"
          minLength="6"
          required
          value={f.password}
          onChange={x=>setF({...f,password:x.target.value})}
        />
        {e&&<div className="error">{e}</div>}
        <button className="primary">
          {mode==="login"?"Sign in":"Create account"}
        </button>
      </form>
      <button
        className="link"
        onClick={()=>setMode(mode==="login"?"register":"login")}
      >
        {mode==="login"
          ?"New here? Create an account"
          :"Already have an account? Sign in"}
      </button>
    </motion.div>
  </div>
}

function Brand(){
  return <div className="brand">
    <div className="logo"><HeartPulse/></div>
    <div>
      <b>MedLog AI</b>
      <span>Personal health intelligence</span>
    </div>
  </div>
}

function Modal({title,close,children}){
  return <div className="overlay">
    <motion.div
      initial={{opacity:0,scale:.97}}
      animate={{opacity:1,scale:1}}
      className="modal"
    >
      <div className="modalhead">
        <h2>{title}</h2>
        <button className="icon" onClick={close}><X/></button>
      </div>
      {children}
    </motion.div>
  </div>
}
{doctorSummary&&
  <Modal
    title="Doctor Summary"
    close={()=>setDoctorSummary(null)}
  >
    <DoctorSummary data={doctorSummary}/>
  </Modal>
}

export default function App(){
  const [logged,setLogged]=useState(!!localStorage.getItem("medlog_access"));
  const [tab,setTab]=useState("overview");
  const [dash,setDash]=useState();
  const [modal,setModal]=useState(null);
  const [ai,setAi]=useState(null);
const [doctorSummary,setDoctorSummary]=useState(null);
  const [toast,setToast]=useState("");

  const load=()=>{
    api("/health/dashboard/")
      .then(setDash)
      .catch(e=>setToast(e.message));
  };

  useEffect(()=>{
    if(logged) load();
  },[logged]);

  if(!logged) return <Auth done={()=>setLogged(true)}/>;

  const logout=()=>{
    localStorage.clear();
    setLogged(false);
  };

  const run=async(path,method="POST")=>{
  try{
    setToast("");

    const result=await api(path,{method});

    if(path==="/health/doctor-summary/"){
      setDoctorSummary(result.generated||result);
    }else{
      setAi(result);
    }
  }catch(e){
    setToast(e.message);
  }
};

  const nav=[
    ["overview","Overview",Activity],
    ["symptoms","Symptoms",HeartPulse],
    ["medications","Medications",Pill],
    ["lifestyle","Lifestyle",CalendarDays],
    ["labs","Lab Reports",FileText]
  ];

  const add=()=>{
    setModal(
      tab==="symptoms"
        ?"symptom"
        :tab==="medications"
        ?"medication"
        :tab==="lifestyle"
        ?"lifestyle"
        :tab==="labs"
        ?"lab"
        :"symptom"
    );
  };

  return <div className="app">
    <aside>
      <Brand/>
      <nav>
        {nav.map(([id,n,I])=>
          <button
            className={tab===id?"nav active":"nav"}
            onClick={()=>setTab(id)}
            key={id}
          >
            <I/>{n}
          </button>
        )}
      </nav>

      <div className="bottom">
        <div className="privacy">
          <ShieldCheck/>
          <span>
            <b>Private records</b>
            <small>User-scoped API access</small>
          </span>
        </div>

        <button className="nav" onClick={logout}>
          <LogOut/>Sign out
        </button>
      </div>
    </aside>

    <main>
      <header>
        <div>
          <p className="eyebrow">PERSONAL HEALTH JOURNAL</p>
          <h1>{nav.find(x=>x[0]===tab)[1]}</h1>
        </div>

        <div className="actions">
          <button
            className="secondary"
            onClick={()=>run("/ai/insights/")}
          >
            <Sparkles/>AI Insights
          </button>

          <button className="primary small" onClick={add}>
            <Plus/>Add
          </button>
        </div>
      </header>

      {toast&&<div className="error banner">{toast}</div>}

      {tab==="overview"&&<Overview d={dash} run={run}/>}

      {tab!=="overview"&&tab!=="labs"&&
        <Records
          type={tab}
          add={add}
        />
      }

      {tab==="labs"&&<Labs add={add}/>}

      {modal&&
        <Entry
          type={modal}
          close={()=>setModal(null)}
          reload={load}
        />
      }

      {ai&&
  <Modal
    title="AI Health Insights"
    close={()=>setAi(null)}
  >
    <AI data={ai.generated||ai}/>
  </Modal>
}
    </main>
  </div>
}

function Overview({d,run}){
  if(!d) return <div className="loading">Loading dashboard…</div>;

  return <div className="content">
    <section className="hero">
      <div>
        <span className="pill">Today · {today}</span>
        <h2>Understand your health journey.</h2>
        <p>
          Log consistently, spot patterns and prepare better information
          for your next appointment.
        </p>
      </div>

      <div className="actions">
        <button
          className="secondary"
          onClick={()=>run("/ai/insights/")}
        >
          <BrainCircuit/>Analyze patterns
        </button>

        <button
  className="secondary"
  onClick={()=>run("/health/doctor-summary/","GET")}
>
  <Stethoscope/>Doctor summary
</button>
      </div>
    </section>

    <div className="stats">
      {Object.entries({
        Symptoms:d.counts.symptoms,
        Medications:d.counts.active_medications,
        Lifestyle:d.counts.lifestyle_entries,
        "Lab reports":d.counts.lab_reports
      }).map(([k,v])=>
        <div className="stat" key={k}>
          <span>{k}</span>
          <strong>{v}</strong>
        </div>
      )}
    </div>

    <div className="twocol">
      <section className="panel">
        <h3>Symptom severity</h3>
        <p className="muted">Average reported severity over time</p>

        <div className="chart">
          {d.symptom_trend.length
            ?<ResponsiveContainer width="100%" height={260}>
              <AreaChart data={d.symptom_trend}>
                <CartesianGrid strokeDasharray="3 3"/>
                <XAxis dataKey="date"/>
                <YAxis domain={[0,10]}/>
                <Tooltip/>
                <Area
                  type="monotone"
                  dataKey="value"
                  fillOpacity=".14"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
            :<Empty text="Log a symptom to see your trend."/>
          }
        </div>
      </section>

      <section className="panel">
        <h3>Recent symptoms</h3>

        {d.recent_symptoms.length
          ?d.recent_symptoms.map(s=>
            <div className="row" key={s.id}>
              <div>
                <b>{s.name}</b>
                <small>
                  {s.date} · {s.body_part||"No body part"}
                </small>
              </div>
              <span className="badge">{s.severity}/10</span>
            </div>
          )
          :<Empty text="No symptoms yet."/>
        }
      </section>
    </div>
  </div>
}

function Records({type,add}){
  const [items,setItems]=useState([]);
  const [error,setError]=useState("");

  const load=()=>{
    setError("");
    api(endpoints[type])
      .then(setItems)
      .catch(e=>setError(e.message));
  };

  useEffect(()=>{
    load();
  },[type]);

  return <div className="content">
    <section className="panel">
      <div className="panelhead">
        <div>
          <h2>{type[0].toUpperCase()+type.slice(1)}</h2>
          <p className="muted">Your health history</p>
        </div>

        <button className="primary small" onClick={add}>
          <Plus/>Add
        </button>
      </div>

      {error&&<div className="error">{error}</div>}

      {items.length
        ?items.map(x=>
          <div className="record" key={x.id}>
            <div>
              <b>{x.name||x.date}</b>
              <small>
                {Object.entries(x)
                  .filter(([k,v])=>
                    !["id","user","created_at","name","date"].includes(k)&&
                    v!==""&&
                    v!==null
                  )
                  .slice(0,5)
                  .map(([k,v])=>
                    k.replaceAll("_"," ")+": "+v
                  )
                  .join(" · ")}
              </small>
            </div>

            <span className="date">
              {x.date||x.start_date}
            </span>
          </div>
        )
        :!error&&<Empty text={"No "+type+" logged yet."}/>
      }
    </section>
  </div>
}

function Labs({add}){
  const [labs,setLabs]=useState([]);
  const [error,setError]=useState("");

  const load=()=>{
    setError("");
    api(endpoints.labs)
      .then(setLabs)
      .catch(e=>setError(e.message));
  };

  useEffect(load,[]);

  const analyze=async id=>{
    try{
      await api(`/health/labs/${id}/analyze/`,{method:"POST"});
      load();
    }catch(e){
      setError(e.message);
    }
  };

  return <div className="content">
    <section className="panel">
      <div className="panelhead">
        <div>
          <h2>Lab reports</h2>
          <p className="muted">
            Upload PDF reports and extract useful information.
          </p>
        </div>

        <button className="primary small" onClick={add}>
          <Upload/>Upload PDF
        </button>
      </div>

      {error&&<div className="error">{error}</div>}

      {labs.length
        ?labs.map(l=>
          <div className="record" key={l.id}>
            <div>
              <b>{l.title}</b>
              <small>
                {l.report_date} · {l.analysis?.summary||"Not analyzed"}
              </small>
            </div>

            <button
              className="secondary small"
              onClick={()=>analyze(l.id)}
            >
              Analyze
            </button>
          </div>
        )
        :!error&&<Empty text="No lab reports uploaded yet."/>
      }
    </section>
  </div>
}

function Entry({type,close,reload}){
  const [f,setF]=useState(
    type==="symptom"
      ?{
        date:today,
        name:"",
        severity:5,
        body_part:"",
        notes:""
      }
      :type==="medication"
      ?{
        name:"",
        dosage:"",
        frequency:"",
        start_date:today,
        adherence:100,
        active:true,
        notes:""
      }
      :{
        date:today,
        sleep_hours:"",
        mood:5,
        stress:5,
        nutrition:5,
        notes:""
      }
  );

  const [file,setFile]=useState();
  const [err,setErr]=useState("");

  async function submit(e){
    e.preventDefault();
    setErr("");

    try{
      if(type==="lab"){
        if(!file){
          setErr("Please select a PDF file.");
          return;
        }

        let fd=new FormData();
        fd.append("title",f.title);
        fd.append("report_date",f.report_date||today);
        fd.append("file",file);

        await api(endpoints.labs,{
          method:"POST",
          body:fd
        });
      }else{
        await api(endpoints[type],{
          method:"POST",
          body:JSON.stringify(f)
        });
      }

      reload();
      close();
    }catch(e){
      setErr(e.message);
    }
  }

  if(type==="lab")
    return <Modal title="Upload lab report" close={close}>
      <form onSubmit={submit}>
        <input
          placeholder="Report title"
          required
          onChange={e=>setF({...f,title:e.target.value})}
        />

        <input
          type="date"
          value={f.report_date||today}
          onChange={e=>setF({...f,report_date:e.target.value})}
        />

        <input
          type="file"
          accept="application/pdf"
          required
          onChange={e=>setFile(e.target.files[0])}
        />

        {err&&<div className="error">{err}</div>}

        <button className="primary">Upload</button>
      </form>
    </Modal>;

  return <Modal title={"Add "+type} close={close}>
    <form onSubmit={submit}>
      {type==="symptom"&&<>
        <input
          type="date"
          value={f.date}
          onChange={e=>setF({...f,date:e.target.value})}
        />

        <input
          placeholder="Symptom name"
          required
          value={f.name}
          onChange={e=>setF({...f,name:e.target.value})}
        />

        <label>
          Severity: {f.severity}/10
          <input
            type="range"
            min="1"
            max="10"
            value={f.severity}
            onChange={e=>setF({...f,severity:+e.target.value})}
          />
        </label>

        <input
          placeholder="Body part"
          value={f.body_part}
          onChange={e=>setF({...f,body_part:e.target.value})}
        />
      </>}

      {type==="medication"&&<>
        <input
          placeholder="Medication"
          required
          value={f.name}
          onChange={e=>setF({...f,name:e.target.value})}
        />

        <div className="two">
          <input
            placeholder="Dosage"
            value={f.dosage}
            onChange={e=>setF({...f,dosage:e.target.value})}
          />

          <input
            placeholder="Frequency"
            value={f.frequency}
            onChange={e=>setF({...f,frequency:e.target.value})}
          />
        </div>

        <input
          type="date"
          value={f.start_date}
          onChange={e=>setF({...f,start_date:e.target.value})}
        />

        <label>
          Adherence: {f.adherence}%
          <input
            type="range"
            min="0"
            max="100"
            value={f.adherence}
            onChange={e=>setF({...f,adherence:+e.target.value})}
          />
        </label>
      </>}

      {type==="lifestyle"&&<>
        <input
          type="date"
          value={f.date}
          onChange={e=>setF({...f,date:e.target.value})}
        />

        <div className="two">
          <input
            type="number"
            step=".1"
            placeholder="Sleep hours"
            value={f.sleep_hours}
            onChange={e=>setF({...f,sleep_hours:e.target.value})}
          />

          <input
            type="number"
            min="1"
            max="10"
            placeholder="Mood 1-10"
            value={f.mood}
            onChange={e=>setF({...f,mood:+e.target.value})}
          />
        </div>

        <div className="two">
          <input
            type="number"
            min="1"
            max="10"
            placeholder="Stress 1-10"
            value={f.stress}
            onChange={e=>setF({...f,stress:+e.target.value})}
          />

          <input
            type="number"
            min="1"
            max="10"
            placeholder="Nutrition 1-10"
            value={f.nutrition}
            onChange={e=>setF({...f,nutrition:+e.target.value})}
          />
        </div>
      </>}

      <textarea
        placeholder="Notes"
        value={f.notes}
        onChange={e=>setF({...f,notes:e.target.value})}
      />

      {err&&<div className="error">{err}</div>}

      <button className="primary">Save entry</button>
    </form>
  </Modal>
}


function DoctorSummary({data}){
  const sections=[
    ["Patient Overview","patient_overview"],
    ["Current Symptoms","current_symptoms"],
    ["Medications","medications"],
    ["Lifestyle","lifestyle"],
    ["Lab Reports","lab_reports"],
    ["Observed Patterns","observed_patterns"],
    ["Points to Discuss","points_to_discuss"],
    ["Clinical Notes","clinical_notes"]
  ];

  return <div className="ai">
    {sections.map(([title,key])=>{
      const value=data[key];

      if(!value||(Array.isArray(value)&&!value.length)) return null;

      return <section key={key}>
        <h4>{title}</h4>

        {Array.isArray(value)
          ?<ul>
            {value.map((item,i)=>
              <li key={i}>
                {typeof item==="string"
                  ?item
                  :JSON.stringify(item)}
              </li>
            )}
          </ul>
          :<p>{value}</p>
        }
      </section>
    })}
  </div>
}


function AI({data}){
  return <div className="ai">
    <div className="aisum">
      <Sparkles/>
      <p>{data.summary||"No summary returned."}</p>
    </div>

    {["trends","correlations","questions_for_doctor","safety_notes"].map(k=>
      data[k]?.length
        ?<section key={k}>
          <h4>{k.replaceAll("_"," ")}</h4>
          <ul>
            {data[k].map((x,i)=>
              <li key={i}>
                {typeof x==="string"?x:JSON.stringify(x)}
              </li>
            )}
          </ul>
        </section>
        :null
    )}
  </div>
}

function Empty({text}){
  return <div className="empty">
    <Activity/>
    <p>{text}</p>
  </div>
}

