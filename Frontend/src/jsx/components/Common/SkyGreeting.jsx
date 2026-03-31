import { useEffect, useRef, useState } from "react";

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return "Good Morning";
    if (hour >= 12 && hour < 17) return "Good Afternoon";
    if (hour >= 17 && hour < 21) return "Good Evening";
    return "Good Night";
};

//  localStorage se user info fetch karo
const getUserInfo = () => {
    try {
        const stored = localStorage.getItem("user");
        const user = stored ? JSON.parse(stored) : null;
        return {
            name: user?.username || user?.name || "Super Admin",
            role: user?.designation || user?.role || "admin",
        };
    } catch {
        return { name: "Super Admin", role: "admin" };
    }
};

const getPhase = (hour, min) => {
    const t = hour + min / 60;
    if (t >= 5 && t < 12) return { name: "morning", ratio: (t - 5) / 7 };
    if (t >= 12 && t < 17) return { name: "afternoon", ratio: (t - 12) / 5 };
    if (t >= 17 && t < 21) return { name: "evening", ratio: (t - 17) / 4 };
    return { name: "night", ratio: t >= 21 ? (t - 21) / 8 : (t + 3) / 8 };
};

const lerpColor = (c1, c2, t) => c1.map((v, i) => Math.round(v + (c2[i] - v) * t));
const rgb = (c) => "rgb(" + c[0] + "," + c[1] + "," + c[2] + ")";

const SKIES = {
    morning: { top: [254, 200, 100], bot: [255, 237, 180] },
    afternoon: { top: [70, 140, 220], bot: [160, 210, 255] },
    evening: { top: [255, 100, 60], bot: [255, 165, 80] },
    night: { top: [10, 10, 40], bot: [30, 30, 80] },
};

const getSkyColors = (name, ratio) => {
    const nextMap = { morning: "afternoon", afternoon: "evening", evening: "night", night: "morning" };
    const cur = SKIES[name];
    const nxt = SKIES[nextMap[name]];
    const blend = ratio > 0.8 ? (ratio - 0.8) / 0.2 : 0;
    return { top: lerpColor(cur.top, nxt.top, blend), bot: lerpColor(cur.bot, nxt.bot, blend) };
};

const getSunMoonPos = (name, ratio) => {
    const arcR = 105;
    const cx = 150;
    const cy = 225;
    let sunAngle;
    let moonAngle;
    if (name === "morning") {
        sunAngle = Math.PI - ratio * (Math.PI * 0.45);
        moonAngle = Math.PI * 1.6;
    } else if (name === "afternoon") {
        sunAngle = Math.PI * 0.55 - ratio * (Math.PI * 0.35);
        moonAngle = Math.PI * 1.7;
    } else if (name === "evening") {
        sunAngle = Math.PI * 0.2 - ratio * (Math.PI * 0.2);
        moonAngle = Math.PI - ratio * (Math.PI * 0.3);
    } else {
        sunAngle = -Math.PI * 0.1;
        moonAngle = Math.PI * 0.7 - ratio * (Math.PI * 0.4);
    }
    return {
        sun: { x: cx + arcR * Math.cos(sunAngle), y: cy - arcR * Math.sin(sunAngle) },
        moon: { x: cx + arcR * Math.cos(moonAngle), y: cy - arcR * Math.sin(moonAngle) },
    };
};

function drawScene(canvas) {
    const ctx = canvas.getContext("2d");
    const W = 300;
    const H = 300;
    const now = new Date();
    const hour = now.getHours();
    const min = now.getMinutes();
    const { name, ratio } = getPhase(hour, min);
    const { top, bot } = getSkyColors(name, ratio);

    ctx.clearRect(0, 0, W, H);
    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2, 0, Math.PI * 2);
    ctx.clip();

    const sky = ctx.createLinearGradient(0, 0, 0, H);
    sky.addColorStop(0, rgb(top));
    sky.addColorStop(1, rgb(bot));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H);

    let starAlpha = 0;
    if (name === "night") {
        starAlpha = 0.85;
    } else if (name === "evening" && ratio > 0.5) {
        starAlpha = (ratio - 0.5) * 0.6;
    }
    if (starAlpha > 0) {
        ctx.save();
        ctx.globalAlpha = starAlpha;
        ctx.fillStyle = "#ffffff";
        var stars = [[40, 60], [80, 30], [150, 20], [220, 45], [260, 70], [100, 80], [180, 50], [240, 110], [50, 130], [290, 40]];
        for (var si = 0; si < stars.length; si++) {
            ctx.beginPath();
            ctx.arc(stars[si][0], stars[si][1], 1.5, 0, Math.PI * 2);
            ctx.fill();
        }
        ctx.restore();
    }

    if (name === "morning" || name === "evening") {
        var glowColor = name === "morning" ? "rgba(255,220,100,0.35)" : "rgba(255,100,40,0.4)";
        var grd = ctx.createRadialGradient(W / 2, H * 0.72, 20, W / 2, H * 0.72, 130);
        grd.addColorStop(0, glowColor);
        grd.addColorStop(1, "rgba(0,0,0,0)");
        ctx.save();
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
    }

    var cloudAlpha = 0;
    if (name === "morning" || name === "afternoon") {
        cloudAlpha = 0.7;
    } else if (name === "evening") {
        cloudAlpha = 0.3;
    }
    if (cloudAlpha > 0) {
        var clouds = [[80, 120, 50, 22], [180, 90, 60, 20], [230, 140, 45, 18]];
        var offsets = [[0, 0, 1, 1], [-20, 8, 0.7, 0.8], [22, 5, 0.65, 0.75]];
        ctx.save();
        ctx.globalAlpha = cloudAlpha * 0.6;
        ctx.fillStyle = "#ffffff";
        for (var ci = 0; ci < clouds.length; ci++) {
            for (var oi = 0; oi < offsets.length; oi++) {
                ctx.beginPath();
                ctx.ellipse(
                    clouds[ci][0] + offsets[oi][0],
                    clouds[ci][1] + offsets[oi][1],
                    clouds[ci][2] * offsets[oi][2],
                    clouds[ci][3] * offsets[oi][3],
                    0, 0, Math.PI * 2
                );
                ctx.fill();
            }
        }
        ctx.restore();
    }

    var pos = getSunMoonPos(name, ratio);
    var sunVis = 0;
    if (name === "night") {
        sunVis = 0;
    } else if (name === "evening") {
        sunVis = Math.max(0, 1 - ratio * 2);
    } else {
        sunVis = 1;
    }
    var moonVis = 0;
    if (name === "morning" || name === "afternoon") {
        moonVis = 0;
    } else if (name === "evening") {
        moonVis = Math.min(1, (ratio - 0.3) * 2);
    } else {
        moonVis = 0.95;
    }

    if (sunVis > 0.05) {
        ctx.save();
        ctx.globalAlpha = Math.min(sunVis, 1);
        for (var ri = 0; ri < 8; ri++) {
            var angle = (ri / 8) * Math.PI * 2;
            ctx.strokeStyle = "rgba(255,220,60,0.7)";
            ctx.lineWidth = 2;
            ctx.lineCap = "round";
            ctx.beginPath();
            ctx.moveTo(pos.sun.x + Math.cos(angle) * 20, pos.sun.y + Math.sin(angle) * 20);
            ctx.lineTo(pos.sun.x + Math.cos(angle) * 28, pos.sun.y + Math.sin(angle) * 28);
            ctx.stroke();
        }
        var sg = ctx.createRadialGradient(pos.sun.x, pos.sun.y, 0, pos.sun.x, pos.sun.y, 16);
        sg.addColorStop(0, "#FFE84D");
        sg.addColorStop(0.6, "#FFD020");
        sg.addColorStop(1, "#FFA500");
        ctx.beginPath();
        ctx.arc(pos.sun.x, pos.sun.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = sg;
        ctx.fill();
        ctx.restore();
    }

    if (moonVis > 0.05) {
        ctx.save();
        ctx.globalAlpha = Math.min(moonVis, 1);
        ctx.beginPath();
        ctx.arc(pos.moon.x, pos.moon.y, 14, 0, Math.PI * 2);
        ctx.fillStyle = "#E8E8D8";
        ctx.fill();
        ctx.beginPath();
        ctx.arc(pos.moon.x + 7, pos.moon.y - 3, 12, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.fill();
        var craters = [[-4, 4, 3, 0.6], [2, -4, 2, 0.5]];
        for (var ki = 0; ki < craters.length; ki++) {
            ctx.beginPath();
            ctx.arc(pos.moon.x + craters[ki][0], pos.moon.y + craters[ki][1], craters[ki][2], 0, Math.PI * 2);
            ctx.fillStyle = "rgba(180,180,160," + craters[ki][3] + ")";
            ctx.fill();
        }
        ctx.restore();
    }

    var hillGrd = ctx.createLinearGradient(0, H * 0.68, 0, H);
    if (name === "night") {
        hillGrd.addColorStop(0, "#1a2a1a");
        hillGrd.addColorStop(1, "#0d1a0d");
    } else if (name === "evening") {
        hillGrd.addColorStop(0, "#2d4a1e");
        hillGrd.addColorStop(1, "#1a2d0f");
    } else {
        hillGrd.addColorStop(0, "#3a6b2a");
        hillGrd.addColorStop(1, "#2a4d1a");
    }
    ctx.beginPath();
    ctx.moveTo(0, H);
    ctx.lineTo(0, H * 0.82);
    ctx.bezierCurveTo(60, H * 0.65, 120, H * 0.78, 150, H * 0.72);
    ctx.bezierCurveTo(180, H * 0.66, 220, H * 0.76, 250, H * 0.70);
    ctx.bezierCurveTo(270, H * 0.65, 290, H * 0.74, W, H * 0.76);
    ctx.lineTo(W, H);
    ctx.closePath();
    ctx.fillStyle = hillGrd;
    ctx.fill();

    ctx.restore();

    ctx.save();
    ctx.beginPath();
    ctx.arc(W / 2, H / 2, W / 2 - 0.5, 0, Math.PI * 2);
    ctx.strokeStyle = "rgba(0,0,0,0.08)";
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

export default function SkyGreeting() {
    const canvasRef = useRef(null);
    const [greeting, setGreeting] = useState(getGreeting());

    //  Dynamic user info — future mein role ke hisaab se alag message bhi dikh sakta hai
    const [userInfo, setUserInfo] = useState(getUserInfo);

    useEffect(() => {
        if (canvasRef.current) drawScene(canvasRef.current);

        const interval = setInterval(() => {
            setGreeting(getGreeting());
            setUserInfo(getUserInfo());    //  har minute refresh — login change pe bhi sync
            if (canvasRef.current) drawScene(canvasRef.current);
        }, 60000);

        //  localStorage change (dusre tab se logout/login) pe bhi sync karo
        const handleStorage = () => setUserInfo(getUserInfo());
        window.addEventListener("storage", handleStorage);

        return () => {
            clearInterval(interval);
            window.removeEventListener("storage", handleStorage);
        };
    }, []);

    return (
        <div className="col-sm-12 mb-sm-4 d-flex align-items-center gap-3">
            <canvas
                ref={canvasRef}
                width={300}
                height={300}
                style={{ width: 55, height: 55, borderRadius: "50%", flexShrink: 0 }}
            />
            <div>
                <h3 className="mb-0">{greeting}, {userInfo.name}</h3>
                <p className="mb-0">{"Here's what's happening with your store today"}</p>
            </div>
        </div>
    );
}