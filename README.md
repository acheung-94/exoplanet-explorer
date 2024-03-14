# Exoplanet Explorer

# Background:
Exoplanet Explorer is a data visualization project that aims to  display and interpret known information about a random exoplanetary system obtained from the NASA Exoplanetary Archive. 

An exoplanetary system is a star system that isn't ours, that also has planetary bodies orbiting around one or more host stars. There are over 5000 exoplanets currently discovered. This project takes you on an imaginative and possibly informative journey to these alien worlds, and hopefully inspire you to wonder what life, if any, exists and how it might differ from our home system.

On initialization, you will be greeted by an information transmission from a fictional Interstellar Task Force that briefs you on the layout of this page. 

To get started, close the transmission and press the **Engage** button to explore a new star system!

Stylistically, this app draws heavy inspiration from Star Trek: The Next Generation. Turn on the music (composed just for this app with lots of ❤) for an enhanced 1990's sci-fi experience!

# Functionality and MVPs:

### Dynamically rendered stars
- Each star system fetched from NASA's exoplanet archive will be rendered on the screen.
- The size & color of the star are based off its measured or calculated radius relative to that of the Sun, and its stellar effective temperature. 
- Red indicates a 'cooler' star, with temperatures around or below 3500 K. A large proportion of stars fall into a middle category of about 4000 - 7000K. You might even find a white dwarf or two in the mix!

### Dynamically rendered planets
- Each planet's orbit simulation is derived from its semi-major axis (The longest radius of an elliptic orbit, or the projected separation in the plane of the sky) and orbital period (the number of days it takes to complete a single rotation around its star.)
- The range of values is extreme, from one day to over 12,000 days, and  0.05 to over 1000 AU. That being said, heavy liberties were taken while scaling and tuning data to ensure practicality of orbit visualization. I utilized d3's linear and logarithmic scaling functions to help maintain integrity of planetary movement while keeping it in a visually pleasing range of pixel values.
Example: 
``
if (!smax) {
    smax = this.estimateSMAxis(this.hostStar, this.data)
}

let orbPerRange = [1, 9000]
let velRange = [0.08, 0.0015]

let velScale = d3.scaleLog().domain(orbPerRange).range(velRange)
velScale.clamp(true)

return velScale(orbper)
``
- Some values, when not available, are extrapolated using light versions Kepler's laws of planetary motion.
``
estimateSMAxis(hostStar, planet) {
hostStar.st_mass = hostStar.st_mass || 1.6
planet.pl_bmasse = planet.pl_bmasse || 1.0

let m1 = hostStar.st_mass * 1.989e30
let m2 = planet.pl_bmasse * 5.972e24
let g = 6.67430e-11
let t = planet.pl_orbper * 86400

let top = (t**2)*g*(m1+m2)
let bottom = (4* Math.PI **2)
let meters = Math.cbrt (top / bottom)

return meters / 1.496e11
}
``
- Planets also have been colorized based on their equilibrium temperatures. Red-orange suggest higher temperatures, green is around 550 K (Earth's EQT is about 550 after other factors.), and blue is less than ~400 K. Gray bodies don't have data available for colorization.

### Selection indicator for planets
- Hovering over a planet highlights it with a target circle to aid tracking of its movement and reference to which planet's card is currently rendered. 
- Never lose track of which planet you're reading about!
- ![img](/assets/video1598897595-ezgif.com-optimize.gif)

### Data management strategy
- Some queries to NASA's database take a little longer than others, based on how the search is performed. Star systems are acquired by defining a random, roughly 5 degree latitudinal range, intersected by a 180 degree longitudinal range. Given a large proportion of data in this archive is collected from Kepler/K2 space telescopes focused on a single conical range of space viewed from earth, this means that some queries will return hundreds of star systems and others will return a handful or none. 
- This variance in data grabs has been worked into this project like so:
- Data is fetched from the archive. If the fetch is empty, the query will call itself recursively until there is 1 or more objects.
- Those objects are parsed and filtered, and placed in a queue. 
- The queue is refreshed when the last object is grabbed and rendered, and triggers another fetch in the background while you enjoy some animations and star system information.
- While fetching, you will not be able to generate a new star system. The 'engage' button will gray out, and your scan status will read 'Long range scan in progress...'
- ![status](/assets/status%20buttons.png)

## In addition, this project will include:

#### A modal with a map of HUD elements
- Use your mouse scroll wheel (or touch pad scroll) to highlight different zones on the page. 
- Additionally, there is a small legend describing the relationship of a star/planet's temperature and its color. 
#### Custom music composed by [Erik Williams](https://soundcloud.com/erik-williams-480392197)
- "Orbit" - A 90's sci-fi inspired ambient track for immersion!

#### This readme.


# Wireframe:
![wireframe](/assets/wireframe-new.png)
### Title: Exoplanet Explorer!
### The header contains information about the following:
- System Name: The name of the star system you're currently in.
- To the left is an visual indicator for the number of stars in this system (in this phase, only one star)
- To the right is a visual indicator of the number of planets in this system.

### Stellar Data Readout
- Contains information about the star's spectral type, effective temperature, mass, radius, metallicity, luminosity, coordinates, and its distance from earth.
- Click on the star or the open/close button below to view the data card.

### Planetary Data Readout
- Contains information about a planet's name, radius, mass, density, temperature, orbital period, discovery year and facility, and detection method.
- Click on a planet or the open/close button below to view the data card.

### Navigation Console - Left
- Navigation status: Notifies you when your ship has acquired new star systems to travel to.
- Modal button if you want to see the instructions again.
- Personal links to github/linkedin.

### Navigation Console -Right
- A. Find a new planet button - click this to fetch a new exoplanet, clear the current canvas and re-render. 
- B. Music off/on *(it fades in / out for those sensitive to sudden loud noises)*
- C. Pause simulation - for an easier time clicking on those speedy planets!

### Toggle planet/star data readouts
- Can be brought up with the buttons on the left and right of the screen, or by clicking on the star / planet, respectively.

# Technologies, Libraries, and APIs:
- Canvas 2D
- Javascript
- CSS and HTML
- NASA’s Exoplanet Archive TAP service
- webpack
- d3.js for scaling data

# Implementation Timeline:
### Thursday & Friday:
- Set up HTML skeleton and implement classes for Star and Planet - identify specific data needed to implement movement, and data for display.
- Query logistics - test requests to TAP service and work out those problems.
### Saturday & Sunday:
- Start logic for movement of planets (crash course in physics)
- Start implementing event handlers & data displays
### Monday 
- Continue planetary movement - if successful, move on
- Continue/finish event handlers & data displays
### Tuesday
- Make any optimizations as necessary
### Wednesday
- CSS styling. 
### Thursday
- D-Day.

# Bonuses:
- Having barely scratched the surface of what d3 can offer for data manipulation and visualization, I want to continue exploring its libraries to hone in on interpreting data values in the context of its habitability. More gauges, charts and scales to come! I also want to add hover cards over each field that gives more detailed information on how that data is measured/calculated, and why it's important. 
- Improve orbital mechanics - consider expressing elliptical orbits with varying inclinations. In that context, I may overhaul the rendering medium entirely as I learn more graphics technologies.
- Add UI options for selecting planets. I may want to create left/right arrows to give the user the option to cycle through the planets instead of selecting each planet individually from the canvas.
- To bring astronomy to anyone who's interested, I want to also add the ability to download or share each star system that they're interested in. They can then use that to find more information elsewhere (self-study), take it to their local astronomy society, or if they're lucky enough to have one, put the coordinates into their own telescopes at home and observe that star system in real life! 
- Improve cross-platform performance. 
