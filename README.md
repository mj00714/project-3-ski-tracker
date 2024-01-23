# project-3-ski-tracker 

# Proposal / Overview

For our third project, we're seeking to build on the material we've covered in the last few modules. We're aiming to create a visualization that will display ski resorts along with their forecasted snowfall. 

### Data
We're utilizing RapidAPI to pull a list of 148 ski resorts (satisfying the project requirement of 100+ records). There are two different views of the resort data- a basic and detailed view. We'll leverage the basic view to avoid paying for API usage. 

We'll extract, transform and load the data using Python libraries. The extraction will be a requests pull from the API. We'll use JSON libraries to clean and transform the data. Finally, we'll load the data into MongoDB using PyMongo. 

Extraction and Load are straightforward. We'll transform the data to combine pages of API data and add pass access information for the '23/'24 season (specifically, Epic and Ikon pass access). The DB will act as a static golden source with the consolidated data. 

### Visualization

After cleaning the data, we'll use Leaflet to create a map visual that will provide the user with information about snow forecasts for the selected resorts. We'll merge the resorts coordinates with weather data from weather.gov to accomplish this. 

# Project readme.md File

### High-level Requirements

Data Visualization Track
1) The project must include visualizations:
- JavaScript(Leaflet)

2) Data must be stored in and extracted from at least one DB
- MongoDB

3) The project must include at least one JavaScript or Py library that we did not cover
- Turf (to calculate the distances to the resorts)

4) The project must be powered by a dataset with at least 100 records
- 148 individual records (the records pulled from 'Ski Resorts and Conditions' via RapidAPI)

5) The project must include some level of user-driven interaction:
- HTML menus (used to select the resort pass type), dropdowns, or textboxes (initial popup that prompts the user for time horizon)
- Visualizations created from user-selected filtered data

6) Visualization should create at least 3 views
- Time horizon popup allows users to select weather forecasts for 12, 24, 36 and 48 hours
- Leaflet HTML menu allows the user to select the resorts that correspond to Epic, Ikon and all other passes

7) The GitHub repository must include a readme.md file (you're reading it) with an outline of the project including:
- An overview of the project and its purpose
- Instructions on how to use and interact with the project
- At least one paragraph summarizing efforts for ethical considerations made in the project
- References for the data sources
- References for any code used that is not your own


### Overview

This project is a shout out to all of the powder hounds out there. Our target user is anyone who has ever planned a ski trip and found themself on a mountain without snow. We wanted to create a resource that would help ski and snowboard enthusiasts plan better trips. 

Mountain excursions are expensive and can be present logistical challenges. Plane reservations, lift tickets, hotel / AirBnB accommodations – all can present obstacles for would be snow athletes.  While most dedicated riders can stomach the prices and planning, the trip can take a dramatic downturn if one element doesn’t fall into place: snow. Our goal is to deliver more snowy days on the hill. 

### Instructions

Ideally, we would want to host this tool on the web- either on it's own page, or within an iFrame on a ski/snowboard site. Since we're doing this at minimum cost, there are a few extra steps to get it to run without hosting. 

Here are the steps to run the tool:

#### Data Import

1) Before you begin, you'll need to identify the target resorts through the Ski Resorts and Conditions API, provided by RapidAPI. Registration for RapidAPI is free and you are allowed to make 10 API pulls/day against the Ski Resort and Condiditions API. The resort list is divided into 6 pages and each page counts as a separate pull request so use care when you're running the ```api_pulls.ipynb``` file. 

2) Enter your API Key into the ```api_keys.py``` file. Save the file. 

3) You're ready to run the code on the ```api_pulls.ipynb``` file. Select <run all> and the outputs should populate. Note that there are extra DataFrames in the file. They were used to check data quality and left in there for anyone who may want to modify the code later. 

3) Next, you'll import this information into MongoDB. Instructions on how to run this are listed toward the bottom of the ```api_pulls.ipynb``` file. Instructions for both Mac and Windows operating systems are listed. The assumption is that you have not installed MongoDB before executing the file. 

4) Once you've installed MongoDB, run the code block listed below the installation instructions to create the DB, collection and records/documents. We recommend downloading the MongoDB Compass application to easily validate the data. 

#### Visualization Rendering

To render the visual in a browser, the assumption is that users will have Live Server (or a similart tool) installed. 

1) The python file ```query.ipynb``` queries the data stored in the MongoDB as well as live weather data from the National Weather Service and Canadian Meterological website APIs. Clicking <run all> will first pull the data from the MongoDB then begin querying the weather APIs. As the program collects weather data, it will display an error message if it is unable to collect data from a specific ski resort. Afterwards, the program writes all the data to a json file called ```resort_data.json```.

2) The JavaScript file is set up run, as is. The code is documented and follows elements we used in class. You should not need to run any code directly from this file. The file pulls data from ```resort_data.json```. 

3) If you're using Live Server, you'll navigate to ```index.html``` and select the <Go Live> button in the bottom right corner of VS Code. This will bring up a browser window. In our case, this is Chrome. 

4) You'll be presented with your first view option when the browser opens. First enter the latitude, then longitude, of the starting location when prompted. The program will use these entries to calculate the distance to each ski resort. Then enter 12, 24, 36 or 48 to select the time horizon of the forecast. For example, if you're accessing the tool on a Thursday afternoon, you'll receive the Saturday forecast by selecting 36 or 48 hours. 

5) After you enter your time horizon, you'll have a blank map in front of you and will need to select the resorts that you want to analyze. If you are looking for Epic or Ikon pass resorts, check either, or both, of those boxes. If you'd like the full resort list, select all resorts. 

6) At this point, you should see markers on the map.
- Green Marker: >50% chance of snow for the given period (US resorts)
- Yellow Marker: <50% chance of snow for the given period (US resorts)
- Black Marker: 0% chance of snow for the given period (US resorts)
- Blue Marker: Canadian resorts - read the popup for the forecast summary

### Ethical Considerations

In the past 5-7 years. Resort capacity has become a concern at many mountains. Lift lines are increasing in length, pass/stay prices are rising and locals in some areas are not happy. A tool like this could drive an influx of non-local skiers to an area. This could:
- Create surplus traffic on and off the mountain
- Further raise the price of lift passes, food / entertainment and accommodations
- Create safety concerns if weather reaches extreme snow accumulation levels

The information we used to create the tool is readily available to the public but creates a lower bar for searching for fresh snow. Our tool does not alert powder seekers of extreme weather and if it reached a point of heavy adoption, we would establish a set of guidelines around how to safely, and courteously, plan your trip. Both the Ikon and Epic pass sites address some of these concerns. 

### Data Sources
- RapidAPI, Ski Resort and Conditions API https://rapidapi.com/hub
- Ikon Pass https://www.ikonpass.com
- Epic Pass https://www.epicpass.com
- US Weather https://www.weather.gov/documentation/services-web-api
- CAN Weather https://dd.weather.gc.ca/citypage_weather/xml/

### Code References
Code for this project was written by the project team members. Templates and structure were borrowed from examples covered in the course and documentation provided by the library authors. 
