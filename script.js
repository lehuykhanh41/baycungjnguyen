const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let img = new Image();

// general settings
let gamePlaying = 0; // 0 for starting, 1 for playing, 2 for lose.
const gravity = 0.74;
const speed = 7;
const size = [50, 33.5];
const jump = -13;
const cTenth = (canvas.width / 10);

var x = document.getElementById("bgm");
var y = document.getElementById("jump");

let muted = false;

let endGameNoti = document.getElementById("endGameNoti");

let index = 0,
    bestScore = 0, 
    flight, 
    flyHeight, 
    currentScore, 
    pipe;

// pipe settings
const pipeWidth = 78;
const pipeGap = 300;
const pipeLoc = () => (Math.random() * ((canvas.height - (pipeGap + pipeWidth)) - pipeWidth)) + pipeWidth;

const setup = () => {
  img = new Image();
  img.src = "./jcatbackground.png";

  x = document.getElementById("bgm");
  y = document.getElementById("jump");

  currentScore = 0;
  flight = jump;

  // set initial flyHeight (middle of screen - size of the bird)
  flyHeight = (canvas.height / 2) - (size[1] / 2);

  // setup first 3 pipes
  pipes = Array(3).fill().map((a, i) => [canvas.width + (i * (pipeGap + pipeWidth)), pipeLoc()]);
}

var score = document.getElementById("count");

const render = () => {

  // tell the browser to perform anim
  if (gamePlaying == 0 || gamePlaying == 1) {
    requestAnimationFrame(render);
  }

  // make the pipe and bird moving 
  index++;

  // ctx.clearRect(0, 0, canvas.width, canvas.height);

  // background first part 
  ctx.drawImage(img, 0, 0, canvas.width-10, canvas.height, -((index * (speed / 2)) % canvas.width) + canvas.width, 0, canvas.width, canvas.height);
  // background second part
  ctx.drawImage(img, 0, 0, canvas.width-10, canvas.height, -(index * (speed / 2)) % canvas.width, 0, canvas.width, canvas.height);
  
  // pipe display
  if (gamePlaying == 1){
    pipes.map(pipe => {
      // pipe moving
      pipe[0] -= speed;

      // top pipe
      ctx.drawImage(img, 432, 588 - pipe[1], pipeWidth, pipe[1], pipe[0], 0, pipeWidth, pipe[1]);
      // bottom pipe
      ctx.drawImage(img, 432 + pipeWidth, 108, pipeWidth, canvas.height - pipe[1] + pipeGap, pipe[0], pipe[1] + pipeGap, pipeWidth, canvas.height - pipe[1] + pipeGap);

      // give 1 point & create new pipe
      if(pipe[0] <= -pipeWidth){
        currentScore++;
      
        // check if it's the best score
        bestScore = Math.max(bestScore, currentScore);
        
        // remove & create new pipe
        pipes = [...pipes.slice(1), [pipes[pipes.length-1][0] + pipeGap + pipeWidth, pipeLoc()]];
        console.log(pipes);
      }
    
      // if hit the pipe, end
      if ([
        pipe[0] <= cTenth + size[0], 
        pipe[0] + pipeWidth >= cTenth, 
        pipe[1] > flyHeight || pipe[1] + pipeGap < flyHeight + size[1]
      ].every(elem => elem)) {
        gamePlaying = 2; // TEST
      }
    })
  }
  // draw bird
  if (gamePlaying == 1) {
    ctx.drawImage(img, 435, Math.floor((index % 9) / 3) * size[1], ...size, cTenth, flyHeight, size[0]+10, size[1]+10);
    flight += gravity;
    flyHeight = Math.min(flyHeight + flight, canvas.height - size[1]);
  } else {
      // text accueil
    if (gamePlaying == 0) {
      ctx.drawImage(img, 435, Math.floor((index % 9) / 3) * size[1], ...size, ((canvas.width / 2) - size[0] / 2), flyHeight, size[0]+10, size[1]+10);
      flyHeight = (canvas.height / 2) - (size[1] / 2);
      ctx.fillText(`TÓP SỜ CO: ${bestScore}`, 100, 198, 414);
      ctx.fillText("CHẠM ĐỂ LÊN ĐỈNH NÚI CÙNG JANE NHÉ!", 30, 435, 350);
      ctx.font = "30px Georgia";
      ctx.fillStyle = "white";
    } else if (gamePlaying == 2) {

      ctx.font = "bold 40px Georgia";
      ctx.fillStyle = "teal";
      ctx.fillText(`JANE ĐÃ HẸO: ${currentScore}`, 30, 110, 414);

      let rand = Math.random();
      if (rand < 0.25) {
        txt = "\"TAO CHÔN NÓ DƯỚI BITEXCO ÒI!\"\n - (JANE NGUYỄN, 2023)";
        x = 10;
        y = 250;
        lineheight = 50;
        lines = txt.split('\n');
      }
      else if (rand < 0.7) {
        txt = "\"CHƠI NHƯ NÀY SAO CÓ TESLA\n NHƯ TAO ĐC?\" - (JANE NGUYỄN, 2023)";
        x = 10;
        y = 250;
        lineheight = 50;
        lines = txt.split('\n');
      }  else {
        txt = "\"NY CŨ CỦA TAO CÒN ĐC\n 80 ĐIỂM!\" - (JANE NGUYỄN, 2023)";
        x = 10;
        y = 250;
        lineheight = 50;
        lines = txt.split('\n');
      }


      ctx.fillStyle = "#FFFFBA";
      ctx.fillRect(x, y-40, 390, 100);

      ctx.fillStyle = "teal";
      ctx.font = "20px Georgia";
      ctx.textAlign = "left";

      for (var i = 0; i<lines.length; i++) {
        ctx.fillText(lines[i], x, y + (i*lineheight), 414);
      }
      
      ctx.fillStyle = "#FFFFBA";
      ctx.fillText("CHẠM ĐỂ CHƠI LẠI ĐÊ", 100, 435, 414);
    }
    
  }
  
  document.getElementById('bestScore').innerHTML = `TÓP TÓP : ${bestScore}`;
  document.getElementById('currentScore').innerHTML = `ĐIỂM : ${currentScore}`;
}

function mute() {
  muted = !muted;
}

// launch setup
setup();
img.onload = render;

var clicked = false;
var clicked2 = false;

// start game
document.addEventListener('click', () => {
  if (gamePlaying == 0) {
    gamePlaying = 1;
  } else if (gamePlaying == 2) {
    gamePlaying = 0;
    setup();
    render();
  }

  if (currentScore > 1) {

    if (currentScore % 5 == 0 && !clicked2) {
      clicked2 = true;
      document.getElementById("currentScore").style.display = "none";
      document.getElementById("bestScore").style.display = "none";
      document.getElementById("muteMusic").style.display = "none";
      score.innerHTML = currentScore;
      document.getElementById("notification").style.display = "inline-block";

      setTimeout(() => {
        document.getElementById("currentScore").style.display = "inline-block";
        document.getElementById("bestScore").style.display = "inline-block";
        document.getElementById("muteMusic").style.display = "inline-block";
        document.getElementById("notification").style.display = "none";
      }, 1000);
    }

    if (currentScore % 10 == 0 && !clicked) {
      clicked = true;
      document.getElementById("congrats").volume = 0.1;
      document.getElementById("congrats").play();
      if(pipeGap > 230) {
        pipeGap-=10;
      }
    }


    if (currentScore % 10 > 0) {
      if (currentScore % 5 > 2) {
        clicked2 = false;
      }
      clicked = false;
    }
  }


  y.play();

  console.log(muted);
  console.log(x);
  console.log(y);

  if (!muted) {
    x.volume = 0.03;
    x.play();
  } else {
    x.pause();
  }
});

window.onclick = () => {
  flight = jump;
}