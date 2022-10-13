title = "close call";

description = `
[tap] stop ball
`;

characters = [
`
 bbbb
bbbbbb
bbllbb
bbllbb
bbbbbb
 bbbb   
`,`
 rrrr
rrrrrr
rrllrr
rrllrr
rrrrrr
 rrrr   
`
];


const G = {
	WIDTH: 100,
	HEIGHT: 200,   
}

options = {
    viewSize: {x: G.WIDTH, y: G.HEIGHT},
    isCapturing: true,
    isCapturingGameCanvasOnly: true,
    captureCanvasScale: 2,
    seed: 1,
    isPlayingBgm: true,
    isReplayEnabled: true
};

/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * isPlaying: boolean,
 * isMoving: boolean,
 * fired: boolean
 * }} PBall
 */

/**
 * @type { PBall }
 */
let pBall;


/**
 * @typedef {{
 * pos: Vector,
 * speed: number,
 * isPlaying: boolean,
 * isMoving: boolean,
 * stopPoint: number,
 * fired: boolean
 * }} CBall
 */

/**
 * @type { CBall }
 */
let cBall;

/**
 * @type { number }
 */
let roundNum;

let speed;


function update() {
    if (!ticks) {
        speed = 2;
        pBall = {
            pos: vec(G.WIDTH * 3/4, G.HEIGHT - 10),
            speed: speed,
            isPlaying: false,
            isMoving: false,
            fired: false
            }
        cBall = {
            pos: vec(G.WIDTH * 1/4, G.HEIGHT - 10),
            speed: speed,
            isPlaying: true,
            isMoving: false,
            stopPoint: 0,
            fired: false
            } 
        roundNum = 1;
    }
    if (cBall.isPlaying) {
        if (!cBall.fired) {
            color("light_blue");
            particle(cBall.pos, 10);
            play("hit");
            cBall.fired = true;
        }
        cBall.isMoving = true;
        cBall.pos.y -= cBall.speed;
        cBall.stopPoint = G.HEIGHT/2 - (roundNum * 7) + 10;
        cBall.pos.clamp(0, G.WIDTH, cBall.stopPoint, G.HEIGHT);

        if (cBall.pos.y == cBall.stopPoint) {
            cBall.isPlaying = false;
            cBall.isMoving = false;
            pBall.isPlaying = true;
            pBall.fired = false;
        }
    } else if (pBall.isPlaying) {
        if (!pBall.fired) {
            color("light_blue");
            particle(pBall.pos, 10);
            play("hit");
            pBall.fired = true;
        }
        color("light_green");
        box(G.WIDTH/2, (cBall.stopPoint + 10)/2, G.WIDTH, cBall.stopPoint - 10);
        pBall.isMoving = true;
        
        if (pBall.isMoving) {
            pBall.pos.y -= pBall.speed;
            if (pBall.pos.y < 14) {
                end();
            }
            if (input.isJustPressed) {
                pBall.isMoving = false; 
                pBall.isPlaying = false;
                if (pBall.pos.y < cBall.stopPoint) {
                    play("coin");
                    score += 10 * roundNum;
                    setTimeout(reset, 700);
                } else {
                    play("explosion");
                    end();
                }
            };
        };

    }
    color("light_blue");
    line(0, G.HEIGHT/2, G.WIDTH, G.HEIGHT/2, 3);
    color("light_red");
    arc(G.WIDTH/2, G.HEIGHT/2, 15, 3);
    

    color("black");
    char("a", pBall.pos);
    char("b", cBall.pos);

    color("red");
    line(0, 10, G.WIDTH, 10, 3); 

    function reset() {
        // return balls to starting point
        pBall.pos = vec(G.WIDTH * 3/4, G.HEIGHT - 10);
        cBall.pos = vec(G.WIDTH * 1/4, G.HEIGHT - 10);

        // next round
        roundNum++;

        // increase ball speed 
        pBall.speed += 0.5;
        cBall.speed += 0.5;

        // computer's turn
        cBall.isPlaying = true;
        cBall.fired = false;
    }

    
}
