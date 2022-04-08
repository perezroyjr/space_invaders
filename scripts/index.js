const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')
const scoreElement = document.querySelector('#score')




canvas.width = 1024
canvas.height = 576

class Player {
	constructor() {

		//When there involves movement you will need velocity
		this.velocity = {
			x: 0,
			y: 0
		}

		//set initial rotation of player - 0 since the player isn't moving
		this.rotation = 0
		this.opacity = 1

		//Create player image
		const image = new Image()
		image.src = './assets/spaceship.png'
		//Wait for image to load then set its configurations
		image.onload = () => {
			const scale = 0.15
			this.image = image
			//Use scale to scale down the image size
			this.width = image.width * scale
			this.height = image.height * scale

			//Starting position on the canvas for the player
			this.position = {
			x: canvas.width / 2 - this.width / 2,
			y: canvas.height - this.height - 20
			}
		}
	}


	//Draw player to screen
	draw() {
		// c.fillStyle = 'red'
		// c.fillRect(this.position.x,this.position.y, this.width, this.height)

		//create snapshot to translate canvas
			c.save()
		// //translate the canvas to the center of the player
		// c.translate(
		// 	player.position.x + player.width, 
		// 	player.position.y)
		//If the image is loaded draw image
		c.globalAlpha = this.opacity
		if(this.image)
			c.drawImage(this.image, this.position.x,this.position.y,this.width,this.height)
	

		 c.restore()
	}

	//update for every frame
	update(){
		//wait until the image exists
		if(this.image){
			//draw image
			this.draw()
			//control the players movement
			this.position.x += this.velocity.x
		}
	}
}

class Projectile {
	constructor({position, velocity}){
		this.position = position
		this.velocity = velocity

		this.radius = 3 
	}

	draw(){
		c.beginPath()
		c.arc(this.position.x, this.position.y,this.radius, 0, Math.PI * 2)
		c.fillStyle = 'red'
		c.fill()
		c.closePath()
	}

	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

	}
}

class Particle {
	constructor({position, velocity, radius, color,fades}){
		this.position = position
		this.velocity = velocity

		this.radius = radius 
		this.color = color
		this.opacity = 1
		this.fades = fades
	}

	draw(){
		c.save()
		c.globalAlpha = this.opacity
		c.beginPath()
		c.arc(this.position.x, this.position.y,this.radius, 0, Math.PI * 2)
		c.fillStyle = this.color
		c.fill()
		c.closePath()
		c.restore()

	}

	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		if(this.fades)
		this.opacity -= 0.01

	}
}

class InvaderProjectile {
	constructor({position, velocity}){
		this.position = position
		this.velocity = velocity

		this.width = 3
		this.height = 10
	}

	draw(){
		c.fillStyle = 'white'
		c.fillRect(this.position.x,this.position.y,this.width,this.height)
	}

	update(){
		this.draw()
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

	}
}

class Invader {
	constructor({position}) {

		//When there involves movement you will need velocity
		this.velocity = {
			x: 0,
			y: 0
		}

		//Create player image
		const image = new Image()
		image.src = './assets/invader.png'
		//Wait for image to load then set its configurations
		image.onload = () => {
			const scale = 1
			this.image = image
			//Use scale to scale down the image size
			this.width = image.width * scale
			this.height = image.height * scale

			//Starting position on the canvas for the player
			this.position = {
			x: position.x,
			y: position.y
			}
		}
	}


	//Draw player to screen
	draw() {
		// c.fillStyle = 'red'
		// c.fillRect(this.position.x,this.position.y, this.width, this.height)

		//If the image is loaded draw image
		if(this.image)
			c.drawImage(this.image, this.position.x,this.position.y,this.width,this.height)
	}

	//update for every frame
	update({velocity}){
		//wait until the image exists
		if(this.image){
			//draw image
			this.draw()
			//control the players movement
			this.position.x += velocity.x
			this.position.y += velocity.y
		}
	}

	shoot(invaderProjectiles){
		invaderProjectiles.push(new InvaderProjectile({
			position:{
				x: this.position.x + this.width / 2,
				y: this.position.y + this.height
			},
			velocity: {
				x: 0,
				y: 5
			}
		})
		)
	}
}

class Grid {
	constructor(){
		this.position = {
			x:0,
			y:0
		},

		this.velocity = {
			x: 3,
			y: 0
		}

		this.invaders = []
		
		const columns = Math.floor(Math.random() * 10 + 5)
		const rows = Math.floor(Math.random() * 5 + 2)

		this.width = columns * 30

		for(let x = 0; x < columns; x++){
		  for(let y= 0; y < rows; y++){
			this.invaders.push(
				new Invader({
					position: {
						x: x * 30,
						y: y * 30
					}
			}))
			}
		}
	}

	update() {
		this.position.x += this.velocity.x
		this.position.y += this.velocity.y

		this.velocity.y = 0

		if(this.position.x + this.width >= canvas.width || this.position.x <= 0){
			this.velocity.x = -this.velocity.x
			this.velocity.y = 30
		}
	}
}

const player = new Player()
const projectiles = []
const grids = []
const invaderProjectiles = []
const particles = []

const keys = {
	a: {
		pressed: false
	},
	d: {
		pressed: false
	},
	space: {
		pressed: false
	}
}

let frames = 0
let randomInterval = Math.floor((Math.random() * 500) + 500) 
let game = {
	over: false,
	active: true
}

let score = 0

for(let i = 0; i < 100; i++){
		particles.push(new Particle({
			position: {
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height
			},
			velocity: {
				x: 0,
		 		y: .3
			},
			radius: Math.random() * 2,
		 	color: 'white'
		})
		)
	}



function createParticles({object,color, fades}){
	for(let i = 0; i < 15; i++){
		particles.push(new Particle({
			position: {
				x: object.position.x + object.width / 2,
				y: object.position.y + object.height / 2
			},
			velocity: {
				x: (Math.random()- 0.5) *2,
		 		y: (Math.random()- 0.5) *2
			},
			radius: Math.random() * 3,
		 	color: color || '#BAA0DE',
		 	fades
		})
		)
	}
}



//Create animation loop and draw black background using fillRect & fillStyle
function animate() {
	if(!game.active) return
	requestAnimationFrame(animate)
	c.fillStyle = 'black'
	c.fillRect(0,0,canvas.width,canvas.height)
	player.update()
	particles.forEach((particle,i) => {

		//respawn star particles across the x & y axis
		if(particle.position.y - particle.radius >= canvas.height){
			particle.position.x = Math.random() * canvas.width
			particle.position.y = -particle.radius
		}


		//Garbage collection for particles
		if(particle.opacity <= 0) {
		setTimeout(() => {
			particles.splice(i,1)
		}, 0)
	}else{
		particle.update()
	}
	})



	invaderProjectiles.forEach((invaderProjectile,index) => {
		//garbage collection
		if(invaderProjectile.position.y + invaderProjectile.height >= canvas.height){
			setTimeout(() => {
				invaderProjectiles.splice(index, 1)
			}, 0)
		}else{
			invaderProjectile.update()
		}


		//if projectile hits player
		if(invaderProjectile.position.y + invaderProjectile.height >= player.position.y
		   && invaderProjectile.position.x + invaderProjectile.width >= player.position.x &&
		   invaderProjectile.position.x <= player.position.x + player.width){
		   	setTimeout(() => {
				invaderProjectiles.splice(index, 1)
				player.opacity = 0
				game.over = true
			}, 0)

		    setTimeout(() => {
				game.active = false
			}, 2000)

			createParticles({
				object: player,
				color: 'white',
				fades: true
			})
		}

	})


	//Draw projectiles to screen
	projectiles.forEach((projectile,index) => {
		//If the projectile is off the screen remove from array otherwise continue shooting projectiles
		if(projectile.position.y + projectile.radius <= 0){
			//Give one additional frame to prevent flashing on the screen  
			setTimeout(() => {
			projectiles.splice(index, 1)
		}, 0)
		}else{
		projectile.update()
		}
	})

	grids.forEach((grid,gridIndex) => {
		grid.update()


		//spawn projectiles from enemies 
		if(frames % 100 === 0 && grid.invaders.length > 0){
			grid.invaders[Math.floor(Math.random() * grid.invaders.length)].shoot(invaderProjectiles)
		}


		grid.invaders.forEach((invader,i) => {
			invader.update({velocity: grid.velocity})

			projectiles.forEach((projectile,j) => {
				if(projectile.position.y - projectile.radius <= invader.position.y + invader.height
					&& projectile.position.x + projectile.radius >= invader.position.x &&
					projectile.position.x - projectile.radius <= invader.position.x  + invader.width &&
					projectile.position.y + projectile.radius >= invader.position.y 
					){

					
					setTimeout(() => {
						const invaderFound = grid.invaders.find(invader2 =>
						{
							return invader2 === invader
						})
						const projectileFound = projectiles.find(projectile2 =>
							projectile2 === projectile)

						//remove invader and projectile
						if(invaderFound && projectileFound){
							score += 100
							scoreElement.innerHTML = score
							createParticles({
								object: invader,
								fades: true
							})

						grid.invaders.splice(i, 1)
						projectiles.splice(j, 1)

						if(grid.invaders.length > 0) {
							const firstInvader = grid.invaders[0]
							const lastInvader = grid.invaders[grid.invaders.length - 1]

							grid.width = lastInvader.position.x - firstInvader.position.x + lastInvader.width
							grid.position.x = firstInvader.position.x
						} else {
							grids.splice(gridIndex,1)
						}
						}
					},0)
				}
			})

		})
	})

	//Keep player from moving off of screen
	if(keys.a.pressed && player.position.x >= 0){
		player.velocity.x = -7
		player.rotation = -0.15
	}else if(keys.d.pressed && player.position.x + player.width <= canvas.width){
		player.velocity.x =  7
		player.rotation = 0.15
	}
	else {
		player.velocity.x = 0
	}


	//spawn a new grid at random
	if(frames % randomInterval === 0){
		grids.push(new Grid)
		randomInterval = Math.floor((Math.random() * 500) + 500)
		frames = 0
	}

	frames++
}

//Use object destructuring to get what key is being pressed without using event
addEventListener('keydown', ({key}) => {
	if(game.over) return
	switch(key){
		case 'a':
			keys.a.pressed = true
			break
		case 'd':
			keys.d.pressed = true
			break
		case ' ':
			projectiles.push(new Projectile({
				position:{
					x: player.position.x + player.width / 2,
					y:player.position.y
				},
				velocity: {
					x: 0,
					y: -10,
				}
			}))
			break			
	}
})

//Stop player from moving when key is lifted
addEventListener('keyup', ({key}) => {
	switch(key){
		case 'a':
			keys.a.pressed = false
			break
		case 'd':
			keys.d.pressed = false
			break
		case ' ':
			break			
	}
})


player.draw()
animate()