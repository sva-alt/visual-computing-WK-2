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
    constructor(bird){
        this.sling = Constraint.create({
            pointA: {
                x: bird.body.position.x,
                y: bird.body.position.y
            },
            bodyB: bird.body, 
            stiffness: 0.05,
            length: 5
        });

        World.add(world, this.sling);

    }

    show(){
        if (this.sling.bodyB) {
        line(this.sling.pointA.x, 
            this.sling.pointA.y, 
            this.sling.bodyB.position.x, 
            this.sling.bodyB.position.y, 
        )
        }
    }

    fly(mc) {
        if(this.sling.bodyB && mc.mouse.button == -1 &&
            this.sling.bodyB.position.x > this.sling.pointA.x + 20) {
                this.sling.bodyB.collisionFilter.category = 1;
                this.sling.bodyB = null;
        }
    }
    attach(bird){
        this.sling.bodyB = bird.body;
    }
}