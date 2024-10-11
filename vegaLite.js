// Create and render the bar chart
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations


async function render1_1() {//Global Sales by Genre
    // load data
    const data = await d3.csv("videogames_wide.csv");
  
    // create a bar chart
    const vlSpec = vl
    .markBar() 
      .data(data)
      .encode(
        vl.y().fieldN("Genre").sort("-x"),
        vl.x().fieldQ("Global_Sales").aggregate("sum"), 
        vl.color().fieldN("Genre")
      )
      .width("container")
      .height(400)
      .toSpec();
  
    vegaEmbed("#view1_1", vlSpec).then((result) => {
      const view = result.view;
      view.run();
    });

  }

  async function render1_2() {//Global Sales by Platform
    // load data
    const data = await d3.csv("videogames_wide.csv");
  
    // create a bar chart
    const vlSpec = vl
    .markBar({ color: '#0ef0f0' }) 
      .data(data)
      .encode(
        vl.y().fieldN("Platform").sort("-x"),
        vl.x().fieldQ("Global_Sales").aggregate("sum")
      )
      .width("container")
      .height(400)
      .toSpec();
  
    vegaEmbed("#view1_2", vlSpec).then((result) => {
      const view = result.view;
      view.run();
    });
  }

  async function render2_1() {//Sales Over Time by Platform
    // load data
    const data = await d3.csv("videogames_wide.csv");
  
    // create a bar chart
    const vlSpec = vl
      .markArea()
      .data(data)
      .encode(
        vl.x().fieldT("Year").sort("-x"),
        vl.y().fieldQ("Global_Sales").aggregate("sum"),
        vl.color().fieldN("Platform"),
      )
      .width("container")
      .height(400)
      .toSpec();
  
    vegaEmbed("#view2_1", vlSpec).then((result) => {
      const view = result.view;
      view.run();
    });
  }

  async function render2_2() {//Sales Over Time by Genre
    // load data
    const data = await d3.csv("videogames_wide.csv");
  
    // create a bar chart
    const vlSpec = vl
      .markArea()
      .data(data)
      .encode(
        vl.x().fieldT("Year").sort("-x"),
        vl.y().fieldQ("Global_Sales").aggregate("sum"),
        vl.color().fieldN("Genre"),
        
      )
      .width("container")
      .height(400)
      .toSpec();
  
    vegaEmbed("#view2_2", vlSpec).then((result) => {
      const view = result.view;
      view.run();
    });
  }


async function render3() {
  const data = await d3.csv("videogames_wide.csv");
  console.log(data);
  const vlSpec = vl
    .markBar()
    .data(data)
    .transform(
      vl.fold(["NA_Sales", "EU_Sales", "JP_Sales", "Other_Sales"]))
    
    .encode(
      vl.x().fieldQ("value").aggregate("sum").axis({ title: "Sales" }),
      vl.y().fieldN("Platform"), 
      vl.tooltip().fieldQ("value").aggregate("sum"),
      vl.color().fieldN("Platform"),
      vl.facet().fieldN('key').columns(4).title("Sales Across Regions by Platform").sort({"op":"count","field":"Name","order":"descending"})
    )
    .width(200)
    .height(300)
    .toSpec();

  vegaEmbed("#view3", vlSpec).then((result) => {
    const view = result.view;
    view.run();
  });
}


async function render4() {
  const data = await d3.csv("videogames_wide.csv");
  console.log(data);
  const vlSpec = vl
    .markBar()
    .data(data)
    .transform(
      vl.fold(["NA_Sales", "EU_Sales", "JP_Sales"]))
    
    .encode(
      vl.x().fieldQ("value").aggregate("sum").axis({ title: "Sales" }),
      vl.y().fieldN("Genre"), 
      vl.tooltip().fieldQ("value").aggregate("sum"),
      vl.color().fieldN("Genre"),
      vl.facet().fieldN('key').columns(3).title("Sales Across Regions by Genre").sort({"op":"count","field":"Name","order":"descending"})
    )
    .width(200)
    .height(300)
    .toSpec();

  vegaEmbed("#view4", vlSpec).then((result) => {
    const view = result.view;
    view.run();
  });
}


// vis1
 render1_1();
 render1_2();

 //vis2
 render2_1();
 render2_2();

 //vis3
 render3();


 //vis4
 render4();
 
