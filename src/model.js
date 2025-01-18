class Box {
    constructor(x, y, w, h, img,durability = 100, options={}){
        this.body = Bodies.rectangle(
            x, y, w, h, options
        );
        this.w = w;
        this.h = h;
        this.img = img;
        this.durability = durability;
        World.add(world, this.body);

    }

    show(){
        push();
        //rectMode(CENTER);
        translate(
            this.body.position.x,
            this.body.position.y,
        )
        rotate(this.body.angle);
        /*rect(
            0,
            0,
            this.w,
            this.h
        );*/
        imageMode(CENTER);
        image(this.img, 0, 0, this.w, this.h);
        pop();
    }
    reduceDurability(amount) {
        this.durability -= amount;
        score += amount;
        if (this.durability <= 0) {
            World.remove(world, this.body);
        }
    }
}

class Ground extends Box {
    constructor(x, y, w, h, img) {
        super(x, y, w, h, img, 1000, { isStatic: true });
    }
}

class Bird {
    constructor(x, y, r, mass, img, lifetime=250){
        this.body = Bodies.circle(x, y, r, {
            restitution: 0.5,
            collisionFilter: {
                category: 2
            }
        });
        this.img = img;
        this.r = r;
        this.lifetime = lifetime;
        this.launched = false;
        this.trajectory = [];
        this.hasCollided = false;
        Body.setMass(this.body, mass);
        World.add(world, this.body);
    }

    show(){
        /*ellipse(this.body.position.x,
            this.body.position.y,
            2*this.body.circleRadius,
            2*this.body.circleRadius
        );*/
        if (this.lifetime > 0) {
            push();
            translate(this.body.position.x, this.body.position.y);
            rotate(this.body.angle);
            imageMode(CENTER);
            image(this.img, 0, 0, 2 * this.body.circleRadius, 2 * this.body.circleRadius);
            pop();
            if (this.launched ) {
                this.lifetime--;
            }
            if (this.launched && !this.hasCollided) {
                this.trajectory.push([this.body.position.x, this.body.position.y]);
            }
        } else {
            World.remove(world, this.body);
        }

        // Dibujar la trayectoria siempre, independientemente de hasCollided
        push();
        stroke(255, 0, 0);
        strokeWeight(8);
        for (let i = 0; i < this.trajectory.length; i+=3) {
            point(this.trajectory[i][0], this.trajectory[i][1]);
        }
        pop();


    }
}

class Pig {
    constructor(x, y, r, img,durability) {
        this.body = Bodies.circle(x, y, r, {
            restitution: 0.5,
            collisionFilter: {
                category: 2
            }
        });
        this.img = img;
        this.r = r;
        this.durability = durability;
        this.isRemoved = false;
        World.add(world, this.body);
    }

    reduceDurability(amount) {
        this.durability -= amount;
        score += amount;
        if (this.durability <= 0 && !this.isRemoved) {
            World.remove(world, this.body);
            score += 10000;
            this.isRemoved = true; // Marcar como eliminado
        }
    }

    show() {
        push();
        translate(this.body.position.x, this.body.position.y);
        rotate(this.body.angle);
        imageMode(CENTER);
        image(this.img, 0, 0, 2 * this.r, 2 * this.r);
        pop();
    }
}

class SlingShot {
    constructor(bird, img) {
        this.sling = Constraint.create({
            pointA: {
                x: bird.body.position.x,
                y: bird.body.position.y,
            },
            bodyB: bird.body,
            stiffness: 0.05,
            length: 5,
        });

        this.slingImage = img;
        this.pointA = this.sling.pointA;
        World.add(world, this.sling);
    }

    show() {
        const { x: x1, y: y1 } = this.pointA;


        if (this.slingImage) {
            image(this.slingImage, x1 - 50, y1 - 20, 80, 100);
        }


        if (this.sling.bodyB) {
            const { x: x2, y: y2 } = this.sling.bodyB.position;

            stroke(48, 22, 8);
            strokeWeight(4);
            line(x1, y1, x2, y2);
        }
    }

    fly(mc) {
        if (
            this.sling.bodyB &&
            mc.mouse.button == -1 &&
            this.sling.bodyB.position.x > this.pointA.x + 20
        ) {

            if (launchSound) {
              setTimeout(() => {
                launchSound.play();
            }, 100);
              slingshotSound.play();
        }
            this.sling.bodyB.collisionFilter.category = 1;
            this.sling.bodyB = null;
            birdLaunched = true;
            bird.launched = true;
        }
    }

    attach(bird) {
        this.sling.bodyB = bird.body;
    }
}
