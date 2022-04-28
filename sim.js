const average = (array) => array.length > 0 ? array.reduce((a, b) => a + b) / array.length : 0;

function Sim(figureId) {
    let thisSim = this;

    this.figureId = figureId;
    this.figure = document.getElementById(figureId);
    
    this.canvas = document.querySelector("#" + figureId + " .canvas");
    let canvas = this.canvas;
    let context = this.canvas.getContext('2d');
    this.ppu = this.canvas.width / 25;
    let ppu = this.ppu;
    this.toPX = function(u) {return (u+3)*thisSim.ppu;}

    this.currentPos = 0;

    this.getCharWidth = function() {return parseFloat(document.querySelector("#" + figureId + " .wInput").value)};
    this.getCharHeight = function() {return parseFloat(document.querySelector("#" + figureId + " .hInput").value)};
    this.getVelocity = function() {return parseFloat(document.querySelector("#" + figureId + " .vInput").value)};
    this.getRainVelocity = function() {return parseFloat(document.querySelector("#" + figureId + " .vrInput").value)};
    this.getDensity = function() {return parseFloat(document.querySelector("#" + figureId + " .sInput").value)};
    this.getDistance = function() {return parseFloat(document.querySelector("#" + figureId + " .dInput").value)};
    if(document.querySelector("#" + figureId + " .tInput") != null) {
        this.getAngle = function() {return parseFloat(document.querySelector("#" + figureId + " .tInput").value)*Math.PI}
    } else {
        this.getAngle = function() {return 0};
    }

    this.interval = 25;
    this.countdown = 1000;
    this.drops = [];
    this.wetness = 0;

    if(thisSim.figureId == "sim4") {
        document.getElementById("wet4").textContent = "Wetness: " + thisSim.wetness;
    }

    let grain = 1;

    for(let i=0; i<=canvas.width; i+=grain) {
        for(let j=0; j<=canvas.height; j+=grain) {
            if(Math.random() < thisSim.getDensity()*grain*grain/(ppu*ppu)) {
                thisSim.drops.push({x:i/ppu+Math.random()*grain, y:j/ppu+Math.random()*grain});
            }
        }
    }

    this.update = function() {
        thisSim.currentPos += thisSim.getVelocity()*(thisSim.interval/1000);

        context.clearRect(0,0,canvas.width,canvas.height);

        context.fillStyle = "black";
        context.strokeStyle = "black";

        context.lineWidth = 3;
        for (i=0; i<20; i++) {
            context.beginPath();
            context.moveTo(thisSim.toPX(i), canvas.height);
            context.lineTo(thisSim.toPX(i), canvas.height - 10);
            context.stroke();
        }

        context.lineWidth = 3;
        context.fillStyle = "green";
        context.strokeStyle = "green";
        context.beginPath();
        context.moveTo(thisSim.toPX(thisSim.getDistance()), canvas.height);
        context.lineTo(thisSim.toPX(thisSim.getDistance()), canvas.height - 3*ppu);
        context.lineTo(thisSim.toPX(thisSim.getDistance() + 1.5), canvas.height - 3*ppu);
        context.lineTo(thisSim.toPX(thisSim.getDistance() + 1.5), canvas.height - 2*ppu);
        context.lineTo(thisSim.toPX(thisSim.getDistance()), canvas.height - 2*ppu);
        context.fill();
        context.stroke();

        for(let i=0; i<=canvas.width; i+=grain) {
            if(Math.random() < thisSim.getDensity()*grain*Math.cos(thisSim.getAngle())*thisSim.getRainVelocity()*(thisSim.interval/1000)/ppu) {
                thisSim.drops.push({x:i/ppu+Math.random()*grain, y:Math.random()*thisSim.getRainVelocity()*(thisSim.interval/1000)});
            }
        }

        if(thisSim.getAngle() != 0) {
            if(thisSim.getAngle() > 0) {
                for(let i=0; i<=canvas.height; i+=grain) {
                    if(Math.random() < thisSim.getDensity()*grain*Math.sin(thisSim.getAngle())*thisSim.getRainVelocity()*(thisSim.interval/1000)/ppu) {
                        thisSim.drops.push({x:Math.random()*thisSim.getRainVelocity()*(thisSim.interval/1000), y:i/ppu+Math.random()*grain});
                    }
                }
            } else {
                for(let i=0; i<=canvas.height; i+=grain) {
                    if(Math.random() < -thisSim.getDensity()*grain*Math.sin(thisSim.getAngle())*thisSim.getRainVelocity()*(thisSim.interval/1000)/ppu) {
                        thisSim.drops.push({x:25-Math.random()*thisSim.getRainVelocity()*(thisSim.interval/1000), y:i/ppu+Math.random()*grain});
                    }
                }
            }
        }

        let deleteList = [];

        for(let drop of thisSim.drops) {
            drop.x += thisSim.getRainVelocity()*(thisSim.interval/1000)*Math.sin(thisSim.getAngle());
            drop.y += thisSim.getRainVelocity()*(thisSim.interval/1000)*Math.cos(thisSim.getAngle());
            if(drop.y > canvas.height/ppu) {
                deleteList.push(drop);
            }
            if(drop.x <= thisSim.currentPos+3 && drop.x >= thisSim.currentPos+3-thisSim.getCharWidth() && 
                drop.y >= canvas.height/ppu - thisSim.getCharHeight()) {
                deleteList.push(drop);
                thisSim.wetness++;
            }
        }

        for(let drop of deleteList) {
            let index = thisSim.drops.indexOf(drop);
            if (index > -1) {
                thisSim.drops.splice(index, 1);
            }
        }

        context.lineWidth = 1;
        context.strokeStyle = "blue";
        for(let drop of thisSim.drops) {
            context.beginPath();
            context.moveTo(drop.x*ppu, drop.y*ppu);
            context.lineTo(drop.x*ppu - 5*Math.sin(thisSim.getAngle()), drop.y*ppu - 5*Math.cos(thisSim.getAngle()));
            context.stroke();
        }

        context.fillStyle = "red";
        context.lineWidth = 0;
        context.fillRect(thisSim.toPX(thisSim.currentPos), canvas.height, -thisSim.getCharWidth()*ppu, -thisSim.getCharHeight()*ppu);

        if(thisSim.currentPos > thisSim.getDistance()) {
            if(thisSim.countdown > 0) {
                thisSim.currentPos = thisSim.getDistance();
                thisSim.countdown -= thisSim.interval;
            } else {
                thisSim.currentPos = 0;
                thisSim.countdown = 1000;
                thisSim.wetness = 0;
            }
        } else {
            if(thisSim.figureId == "sim4") {
                document.getElementById("wet4").textContent = "Wetness: " + thisSim.wetness;
            }
            thisSim.countdown = 1000;
        }
    }

    window.setInterval(function() {
        if(isElementInViewport(canvas)) {
            thisSim.update();
        }
    }, this.interval);
}

function isElementInViewport (el) {

    // Special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.bottom >= 0 &&
        rect.right >= 0 &&
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        rect.left <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    ) && el.style.display != "none";
}

function Graph(figureId) {
    let thisSim = this;

    this.figureId = figureId;
    this.figure = document.getElementById(figureId);
    
    this.canvas = document.querySelector("#" + figureId + " .canvas");
    let canvas = this.canvas;
    let context = this.canvas.getContext('2d');
    this.ppux = 50;
    this.ppuy = 1.5;
    let ppux = this.ppux;
    let ppuy = this.ppuy;

    this.getCharWidth = function() {return parseFloat(document.querySelector("#" + figureId + " .wInput").value)};
    this.getCharHeight = function() {return parseFloat(document.querySelector("#" + figureId + " .hInput").value)};
    this.getRainVelocity = function() {return parseFloat(document.querySelector("#" + figureId + " .vrInput").value)};
    this.getDensity = function() {return parseFloat(document.querySelector("#" + figureId + " .sInput").value)};
    this.getDistance = function() {return parseFloat(document.querySelector("#" + figureId + " .dInput").value)};
    if(document.querySelector("#" + figureId + " .tInput") != null) {
        this.getAngle = function() {return parseFloat(document.querySelector("#" + figureId + " .tInput").value)*Math.PI}
    } else {
        this.getAngle = function() {return 0};
    }


    this.R = function(v) {
        s = thisSim.getDensity();
        w = thisSim.getCharWidth();
        h = thisSim.getCharHeight();
        vr = thisSim.getRainVelocity();
        D = thisSim.getDistance();
        t = thisSim.getAngle();

        return s*w*vr*D*Math.cos(t)/v + s*h*D*Math.abs(v-vr*Math.sin(t))/v;
    }

    this.update = function() {
        context.clearRect(0,0,canvas.width,canvas.height);

        context.fillStyle = "blue";
        context.strokeStyle = "blue";

        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(1, canvas.height - thisSim.R(1/ppux)*ppuy);
        for (i=1; i<=canvas.width; i++) {
            context.lineTo(i, canvas.height - thisSim.R(i/ppux)*ppuy);
        }
        context.stroke();
    }

    
    document.querySelector("#" + figureId + " .wInput").addEventListener("input", this.update);
    document.querySelector("#" + figureId + " .hInput").addEventListener("input", this.update);
    document.querySelector("#" + figureId + " .vrInput").addEventListener("input", this.update);
    document.querySelector("#" + figureId + " .tInput").addEventListener("input", this.update);
    document.querySelector("#" + figureId + " .sInput").addEventListener("input", this.update);
    document.querySelector("#" + figureId + " .dInput").addEventListener("input", this.update);

    this.update();
}

function GraphExp(figureId) {
    let thisSim = this;

    this.figureId = figureId;
    this.figure = document.getElementById(figureId);
    
    this.canvas = document.querySelector("#" + figureId + " .canvas");
    let canvas = this.canvas;
    let context = this.canvas.getContext('2d');
    this.ppux = 50;
    this.ppuy = 1.5;
    let ppux = this.ppux;
    let ppuy = this.ppuy;
    let ppu = canvas.width / 25;

    this.interval = 25;
    this.res = 10;
    let res = this.res;
    this.values = [];

    this.getCharWidth = function() {return parseFloat(document.querySelector("#" + figureId + " .wInput").value)};
    this.getCharHeight = function() {return parseFloat(document.querySelector("#" + figureId + " .hInput").value)};
    this.getRainVelocity = function() {return parseFloat(document.querySelector("#" + figureId + " .vrInput").value)};
    this.getDensity = function() {return parseFloat(document.querySelector("#" + figureId + " .sInput").value)};
    this.getDistance = function() {return parseFloat(document.querySelector("#" + figureId + " .dInput").value)};
    if(document.querySelector("#" + figureId + " .tInput") != null) {
        this.getAngle = function() {return parseFloat(document.querySelector("#" + figureId + " .tInput").value)*Math.PI}
    } else {
        this.getAngle = function() {return 0};
    }


    this.R = function(v) {
        s = thisSim.getDensity();
        w = thisSim.getCharWidth();
        h = thisSim.getCharHeight();
        vr = thisSim.getRainVelocity();
        D = thisSim.getDistance();
        t = thisSim.getAngle();

        return s*w*vr*D*Math.cos(t)/v + s*h*D*Math.abs(v-vr*Math.sin(t))/v;
    }

    this.update = function() {
        context.clearRect(0,0,canvas.width,canvas.height);

        context.fillStyle = "red";
        for (let j=0; j<thisSim.values.length; j++) {
            context.fillRect(j*res+50, canvas.height, res-5, -average(thisSim.values[j]))
        }

        context.fillStyle = "blue";
        context.strokeStyle = "blue";

        context.lineWidth = 3;
        context.beginPath();
        context.moveTo(1, canvas.height - thisSim.R(1/ppux)*ppuy);
        for (let i=1; i<=canvas.width; i++) {
            context.lineTo(i, canvas.height - thisSim.R(i/ppux)*ppuy);
        }
        context.stroke();
    }

    this.counter = 10;

    this.reset = function() {
        thisSim.values = [];
        for (let i=50; i<=canvas.width; i+=res) {
            thisSim.values.push([]);
        }
        thisSim.update();
        thisSim.counter = 10;
    }

    this.play = function() {
        let charWidth = thisSim.getCharWidth();
        let charHeight = thisSim.getCharHeight();
        let rainVelocity = thisSim.getRainVelocity();
        let density = thisSim.getDensity();
        let distance = thisSim.getDistance();
        let angle = thisSim.getAngle();

        for (let j=0; j<thisSim.values.length; j++) {

            let currentPos = 0;
            let wetness = 0;
            let drops = [];
            let grain = 1;

            let velocity = (j*res+50)/ppux;

            for(let i=0; i<=canvas.width; i+=grain) {
                for(let k=0; k<=canvas.height; k+=grain) {
                    if(Math.random() < density*grain*grain/(ppu*ppu)) {
                        drops.push({x:i/ppu+Math.random()*grain, y:k/ppu+Math.random()*grain});
                    }
                }
            }

            while (currentPos < distance) {
                currentPos += velocity*(thisSim.interval/1000);

                for(let i=0; i<=canvas.width; i+=grain) {
                    if(Math.random() < density*grain*Math.cos(angle)*rainVelocity*(thisSim.interval/1000)/ppu) {
                        drops.push({x:i/ppu+Math.random()*grain, y:Math.random()*rainVelocity*(thisSim.interval/1000)});
                    }
                }

                if(angle != 0) {
                    if(angle > 0) {
                        for(let i=0; i<=canvas.height; i+=grain) {
                            if(Math.random() < density*grain*Math.sin(angle)*rainVelocity*(thisSim.interval/1000)/ppu) {
                                drops.push({x:Math.random()*rainVelocity*(thisSim.interval/1000), y:i/ppu+Math.random()*grain});
                            }
                        }
                    } else {
                        for(let i=0; i<=canvas.height; i+=grain) {
                            if(Math.random() < -density*grain*Math.sin(angle)*rainVelocity*(thisSim.interval/1000)/ppu) {
                                drops.push({x:25-Math.random()*rainVelocity*(thisSim.interval/1000), y:i/ppu+Math.random()*grain});
                            }
                        }
                    }
                }

                let deleteList = [];

                for(let drop of drops) {
                    drop.x += rainVelocity*(thisSim.interval/1000)*Math.sin(angle);
                    drop.y += rainVelocity*(thisSim.interval/1000)*Math.cos(angle);
                    if(drop.y > canvas.height/ppu) {
                        deleteList.push(drop);
                    }
                    if(drop.x <= currentPos+3 && drop.x >= currentPos+3-charWidth && 
                        drop.y >= canvas.height/ppu - charHeight) {
                        deleteList.push(drop);
                        wetness++;
                    }
                }

                for(let drop of deleteList) {
                    let index = drops.indexOf(drop);
                    if (index > -1) {
                        drops.splice(index, 1);
                    }
                }
            }
            thisSim.values[j].push(wetness);
        }

        thisSim.update();
    }
    
    document.querySelector("#" + figureId + " .wInput").addEventListener("input", this.reset);
    document.querySelector("#" + figureId + " .hInput").addEventListener("input", this.reset);
    document.querySelector("#" + figureId + " .vrInput").addEventListener("input", this.reset);
    document.querySelector("#" + figureId + " .tInput").addEventListener("input", this.reset);
    document.querySelector("#" + figureId + " .sInput").addEventListener("input", this.reset);
    document.querySelector("#" + figureId + " .dInput").addEventListener("input", this.reset);

    this.reset();

    window.setInterval(function() {
        if(isElementInViewport(canvas)) {
            if(thisSim.counter > 0) {
                thisSim.play();
                thisSim.counter--;
            }
        }
    }, 100);
}

var sim1 = new Sim("sim1");
var sim2 = new Sim("sim2");
var graph3 = new Graph("graph3");
var sim4 = new Sim("sim4");
var graph5 = new GraphExp("graph5");


function animation() {
    animation.disabled = true;
    statistics.disabled = false;
    sim4.figure.style.display = "flex";
    graph5.figure.style.display = "none";
}

function statistics() {
    animation.disabled = false;
    statistics.disabled = true;
    sim4.figure.style.display = "none";
    graph5.figure.style.display = "flex";
}

// function Sim(figureId, getAcc, adjustAcc, adjustVel, adjustPV) {
//     sims.push(this);

//     this.figureId = figureId;
//     this.figure = document.getElementById(figureId);
//     this.adjustAcc = adjustAcc;
//     this.adjustVel = adjustVel;
//     this.adjustPV = adjustPV;
//     this.noise = noise;

//     this.interval = 0.05;

//     this.errorBar = document.querySelector("#" + figureId + " .errorBar");
//     this.accBar = document.querySelector("#" + figureId + " .accBar");
//     this.accPBar = document.querySelector("#" + figureId + " .accPBar") || null;
//     this.accIBar = document.querySelector("#" + figureId + " .accIBar") || null;
//     this.accDBar = document.querySelector("#" + figureId + " .accDBar") || null;

//     this.car = document.querySelector("#" + figureId + " .car");
//     this.spSlider = document.querySelector("#" + figureId + " .spSlider");

//     this.graph = document.querySelector("#" + figureId + " .graph") || null;
//     if(this.graph) {
//         this.ctx = this.graph.getContext("2d");
//         this.graphDuration = 15;
//         this.graphTicks = this.graphDuration/this.interval;
//     }

//     this.playButton = document.querySelector("#" + figureId + " .play");
//     this.pauseButton = document.querySelector("#" + figureId + " .pause");
//     this.resetButton = document.querySelector("#" + figureId + " .reset");

//     this.playButton.classList.add("visible");
//     this.pauseButton.classList.remove("visible");
//     this.resetButton.classList.add("visible");

//     var thisSim = this;

//     this.getError = function() {
//         return this.sp - this.pv;
//     }

//     this.update = function() {
//         this.time += this.interval;
//         this.sp = this.spSlider.value;
//         this.error = this.getError();

//         if(this.lastError != null) {
//             this.integral += this.interval * (this.error + this.lastError)/2;
//             this.derivative = (this.error - this.lastError)/this.interval;
//         }
        
//         this.acc = getAcc(this);
//         for(let adjustAcc of this.adjustAcc) {
//             adjustAcc(this);
//         }
//         this.vel += this.acc * this.interval;
//         for(let adjustVel of this.adjustVel) {
//             adjustVel(this);
//         }
//         this.pv += this.vel * this.interval;
//         for(let adjustPV of this.adjustPV) {
//             adjustPV(this);
//         }

//         this.lastError = this.error;

//         this.pvs.unshift(this.pv);
//         this.sps.unshift(this.sp);

//         this.draw();
//     }

//     this.draw = function() {
//         this.car.style.left = (this.pv-0.5)*100 + "%";

//         this.errorBar.style.left = (this.pv + Math.min(0,this.error))*100 + "%";
//         this.errorBar.style.width = Math.abs(this.error)*100 + "%";

//         this.accBar.style.left = (this.pv + Math.min(0,this.acc))*100 + "%";
//         this.accBar.style.width = Math.abs(this.acc)*100 + "%";

//         if(this.accPBar) {
//             this.accPBar.style.left = (this.pv + Math.min(0,this.accP))*100 + "%";
//             this.accPBar.style.width = Math.abs(this.accP)*100 + "%";
//         }

//         if(this.accIBar) {
//             this.accIBar.style.left = (this.pv + Math.min(0,this.accI))*100 + "%";
//             this.accIBar.style.width = Math.abs(this.accI)*100 + "%";
//         }

//         if(this.accDBar) {
//             this.accDBar.style.left = (this.pv + Math.min(0,this.accD))*100 + "%";
//             this.accDBar.style.width = Math.abs(this.accD)*100 + "%";
//         }

//         if(this.graph) {
//             this.ctx.clearRect(0, 0, this.graph.width, this.graph.height);
//             this.ctx.lineWidth = 5;

//             this.ctx.strokeStyle = "blue";
//             this.ctx.beginPath();
//             this.ctx.moveTo(this.sp*this.graph.width, 0);
//             for(var i=1; i<this.graphTicks; i++) {
//                 this.ctx.lineTo(this.sps[i]*this.graph.width, i*this.graph.height/this.graphTicks);
//             }
//             this.ctx.stroke();

//             this.ctx.strokeStyle = "red";
//             this.ctx.beginPath();
//             this.ctx.moveTo(this.pv*this.graph.width, 0);
//             for(var i=1; i<this.graphTicks; i++) {
//                 this.ctx.lineTo(this.pvs[i]*this.graph.width, i*this.graph.height/this.graphTicks);
//             }
//             this.ctx.stroke();
//         }
        
//     }

//     this.play = function() {
//         this.loop = setInterval(function() {thisSim.update()}, this.interval*1000);

//         this.playButton.classList.remove("visible");
//         this.pauseButton.classList.add("visible");

//         runningSims.push(this);
//     }

//     this.pause = function() {
//         clearInterval(this.loop);

//         this.playButton.classList.add("visible");
//         this.pauseButton.classList.remove("visible");

//         let index = runningSims.indexOf(this);
//         if (index > -1) { runningSims.splice(index, 1); }
//     }

//     this.reset = function() {
//         this.spSlider.value = 0.5;
//         this.sp = this.spSlider.value;
//         this.pv = 0.1;

//         this.sps = [];
//         this.pvs = [];

//         this.time = 0;
//         this.vel = 0;
//         this.error = this.sp - this.pv;
//         this.lastError = null;
//         this.acc = getAcc(this);


//         this.integral = 0;
//         this.derivative = 0;

//         this.update();
//     }

//     this.playButton.addEventListener("click", function() {thisSim.play();});
//     this.pauseButton.addEventListener("click", function() {thisSim.pause();});
//     this.resetButton.addEventListener("click", function() {thisSim.reset();});

//     this.reset();
// }

// function getAccBB(sim) {
//     if(sim.error > 0) {
//         return document.querySelector("#" + sim.figureId + " .accInput").value;
//     } else if(sim.error < 0) {
//         return -document.querySelector("#" + sim.figureId + " .accInput").value;
//     } else {
//         return 0;
//     }
// }

// function getAccP(sim) {
//     sim.accP = document.querySelector("#" + sim.figureId + " .pInput").value * sim.error;
//     return sim.accP;
// }

// function getAccPI(sim) {
//     sim.accI = document.querySelector("#" + sim.figureId + " .iInput").value * sim.integral;
//     return getAccP(sim) + sim.accI;
// }

// function getAccPID(sim) {
//     sim.accD = document.querySelector("#" + sim.figureId + " .dInput").value * sim.derivative;
//     return getAccPI(sim) + sim.accD;
// }

// function minAcc(sim) {
//     if(Math.abs(sim.vel) < 0.05 && Math.abs(sim.acc) < document.querySelector("#" + sim.figureId + " .minAccInput").value) {
//         sim.acc = 0;
//     }
// }

// function damp(sim) {
//     sim.vel *= 1.0-document.querySelector("#" + sim.figureId + " .dampInput").value;
// }

// function noise(sim) {
//     sim.pv += (Math.random()-0.5)*document.querySelector("#" + sim.figureId + " .noiseInput").value;
// }

// function createSims() {
//     BBSim1.sim = new Sim("BBSim1", getAccBB, [], [], []);
//     BBSim2.sim = new Sim("BBSim2", getAccBB, [], [], []);
//     PSim3.sim = new Sim("PSim3", getAccP, [], [], []);
//     PSim4.sim = new Sim("PSim4", getAccP, [minAcc], [damp], []);
//     PISim5.sim = new Sim("PISim5", getAccPI, [minAcc], [damp], []);
//     PIDSim6.sim = new Sim("PIDSim6", getAccPID, [minAcc], [damp], []);
//     PIDSim7.sim = new Sim("PIDSim7", getAccPID, [minAcc], [damp], [noise]);
//     PIDSim8.sim = new Sim("PIDSim8", getAccPID, [minAcc], [damp], [noise]);
// }

// var sims = [];
// var runningSims = [];
// window.addEventListener("scroll", function() {
//     let simsToPause = [];
//     for(let sim of runningSims) {
//         let box = sim.figure.getBoundingClientRect();
//         if(box.top > window.innerHeight || box.bottom < 0) {
//             simsToPause.push(sim);
//         }
//     }
//     for(let sim of simsToPause) {
//         sim.pause();
//     }
// });

// createSims();

