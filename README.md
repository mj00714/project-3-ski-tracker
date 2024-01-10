# project-3-ski-tracker

# Proposal / Overview

For our third project, we're seeking to build on the material we've covered in the last few modules. We're aiming to create a visualization that will display ski resorts along with their recent snowfall metrics. 

### Data
We're utilizing RapidAPI to pull a list of 148 ski resorts (satisfying the project requirement of 100+ records). There are two different views of the resort data- a basic and detailed view. 

At this point, we're unsure if we're going to use the recent snowfall totals provided by the ski resort API, or link the coordinates to a more comprehensive weather API. This could get complicated.  With that in mind, our initial plan is to pull the recent snowfall data from the resort API and detarmine next steps from there. 

##### Basic Resort View:
- Resort name
- Resort coordinates
- Region / Country (double check this)

##### Detailed Resort View:
- Fill in

### JavaScript Code/Libraries

We're seeking to create a map (not Leaflet) that will serve as an interactive visual. We're still deciding which map service to use but we plan to create layers that could slice the data by:
- Resort size (by acreage)
- Region
- Inclusive pass (Ikon vs. Epic)
- Percentage of lifts currently open
- Current snowpack base depths

Once we've selected our visualization library/tool we'll execute the following steps:
- Create a base map
- Create 2-4 map layers that can be dynamically selected by the user
- Use the map's visualization tools to create markers indicating recent (12, 24, 48 hour) snowfall
