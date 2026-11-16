var temp = msg.payload;
var limit = 25;
var myChatId = 0; // set your own Telegram chat ID
// Remember previous state (Memory)
var lastState = flow.get("state") || "safe";
var win, status, audio, tel;

// --- SCENARIO 1: DANGER STARTED (High Temperature) ---
if (temp > limit && lastState !== "danger") {
flow.set("state", "danger");
win = { payload: "OPEN" };
status = { payload: "🚨 ALARM! HIGH TEMPERATURE: " + temp + "°C" };

// AUDIO ALERT - REPEAT 3 TIMES!
var message = "Emergency! High Temperature Detected! Opening Windows! ";
audio = { payload: message + "... " + message + "... " };

// TELEGRAM MESSAGE
tel = { payload: { chatId: myChatId, type: 'message', content: "🚨 ALARM! Temp: " + temp
+ "°C. Window Opening!" }};
return [win, status, audio, tel];
}

// --- SCENARIO 2: DANGER OVER (Return to Normal) ---
else if (temp <= limit && lastState === "danger") {
flow.set("state", "safe");
win = { payload: "CLOSED" };
status = { payload: "✅ SYSTEM NORMAL. Temperature: " + temp + "°C" };

// AUDIO FEEDBACK (Talking when closing)
audio = { payload: "Temperature is normal. Closing Windows." };

// TELEGRAM MESSAGE
tel = { payload: { chatId: myChatId, type: 'message', content: "✅ Normal. Temp: " + temp +
"°C. Window Closed." }};
return [win, status, audio, tel];
}

// --- SCENARIO 3: STATE UNCHANGED (Silent Update) ---
else {
// Only update the text on screen, do not speak
status = { payload: (lastState==="danger"?"🚨 ALARM: ":"✅ NORMAL: ") + temp + "°C"
};
return [null, status, null, null];
}