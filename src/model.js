class Box {
    constructor(x, y, w, h, img, options={}){
        this.body = Bodies.rectangle(
            x, y, w, h, options
        );
        this.w = w;
        this.h = h;
        this.img = img;
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
}

class Ground extends Box {
    constructor(x, y, w, h, img){
        super(x, y, w, h, img, {isStatic: true})

    }
}

class Bird {
    constructor(x, y, r, mass, img){
        this.body = Bodies.circle(x, y, r, {
            restitution: 0.5,  
            collisionFilter: {
                category: 2
            }
        });
        this.img = img;
        Body.setMass(this.body, mass);
        World.add(world, this.body);

    }

    show(){
        /*ellipse(this.body.position.x,
            this.body.position.y,
            2*this.body.circleRadius,
            2*this.body.circleRadius
        );*/
        push();
        translate(
            this.body.position.x,
            this.body.position.y
        );
        rotate(this.body.angle);
        imageMode(CENTER);
        image(this.img,
            0,
            0,
            2*this.body.circleRadius,
            2*this.body.circleRadius
        );
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
            this.sling.bodyB.collisionFilter.category = 1;
            this.sling.bodyB = null; 
        }
    }

    attach(bird) {
        this.sling.bodyB = bird.body; 
    }
}
