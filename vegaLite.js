// Create and render the bar chart
// async function to load data from datasets/videogames_long.csv using d3.csv and then make visualizations


async function render1_1() {//Global Sales by Genre
    // load data
    const data = await d3.csv("videogames_wide.csv");
  
    // create a bar chart
    const vlSpec = vl
    .markBar({ color: '#0ef0f0' }) 
      .data(data)
      .encode(
        vl.y().fieldN("Genre").sort("-x"),
        vl.x().fieldQ("Global_Sales").aggregate("sum")
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
      .markLine()
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
      .markLine()
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

  /** 
  async function render3_1() {//Regional Sales vs. Platform
    // load data
    const data = await d3.csv("videogames_wide.csv");

    
    const salesData = data.flatMap(row => [
        { Platform: row.Platform, Region: "NA", Sales: +row.NA_Sales },
        { Platform: row.Platform, Region: "EU", Sales: +row.EU_Sales },
        { Platform: row.Platform, Region: "JP", Sales: +row.JP_Sales },
        { Platform: row.Platform, Region: "Other", Sales: +row.Other_Sales }
    ]);
    
    
    const vlSpec = vl
      .markBar()
      .data(salesData)  
      .encode(
        vl.x().fieldN("Region"),  
        vl.xOffset().fieldN("Platform"),  
        vl.y().fieldQ("Sales").aggregate("sum"),  
        vl.color().fieldN("Platform"),  
        vl.tooltip([  
          vl.fieldN("Platform"),
          vl.fieldN("Region"),
          vl.fieldQ("Sales")
        ])
      )
      .width("container")
      .height(400)
      .toSpec();

    vegaEmbed("#view3_1", vlSpec).then((result) => {
      const view = result.view;
      view.run();
    });
}
  
*/

async function render3_1() {
    // Load data
    const data = await d3.csv("videogames_wide.csv");

    const vlSpec = vl
    .markBar() 
    .data(data)
    
    .encode(
      vl.y().fieldN("Platform"),
      vl.x().fieldQ("NA_Sales").aggregate("sum").scale({ domain: [0, 600] }),
      
    )
    .width(200) // Adjust width for each column
    .height(400)
    .toSpec();

  vegaEmbed("#view3_1", vlSpec).then((result) => {
    const view = result.view;
    view.run();
    });
  }

  async function render3_2() {
    // Load data
    const data = await d3.csv("videogames_wide.csv");

    const vlSpec = vl
    .markBar() 
    .data(data)
    
    .encode(
      vl.y().fieldN("Platform"),
      vl.x().fieldQ("EU_Sales").aggregate("sum").scale({ domain: [0, 600] }),
      
    )
    .width(200) // Adjust width for each column
    .height(400)
    .toSpec();

  vegaEmbed("#view3_2", vlSpec).then((result) => {
    const view = result.view;
    view.run();
    });
  }

  async function render3_3() {
    // Load data
    const data = await d3.csv("videogames_wide.csv");

    const vlSpec = vl
    .markBar() 
    .data(data)
    
    .encode(
      vl.y().fieldN("Platform"),
      vl.x().fieldQ("JP_Sales").aggregate("sum").scale({ domain: [0, 600] }),
      
    )
    .width(200) // Adjust width for each column
    .height(400)
    .toSpec();

  vegaEmbed("#view3_3", vlSpec).then((result) => {
    const view = result.view;
    view.run();
    });
  }

  async function render3_4() {
    // Load data
    const data = await d3.csv("videogames_wide.csv");

    const vlSpec = vl
    .markBar() 
    .data(data)
    
    .encode(
      vl.y().fieldN("Platform"),
      vl.x().fieldQ("Other_Sales").aggregate("sum").scale({ domain: [0, 600] }),
      
    )
    .width(200) // Adjust width for each column
    .height(400)
    .toSpec();

  vegaEmbed("#view3_4", vlSpec).then((result) => {
    const view = result.view;
    view.run();
    });
  }

  async function render4_1() {
     // Load data
    const data = await d3.csv("videogames_wide.csv");

    const vlSpec = vl
    .markBar() 
    .data(data)
    
    .encode(
      vl.y().fieldN("Genre"),
      vl.x().fieldQ("NA_Sales").aggregate("sum").scale({ domain: [0, 900] }),
      vl.tooltip().fieldQ('NA_Sales').aggregate('sum')
      
  )
    .width(200) // Adjust width for each column
    .height(400)
    .toSpec();

  vegaEmbed("#view4_1", vlSpec).then((result) => {
    const view = result.view;
    view.run();
    });
  }
  
  async function render4_2() {
    // Load data
   const data = await d3.csv("videogames_wide.csv");

   const vlSpec = vl
   .markBar() 
   .data(data)
   
   .encode(
     vl.y().fieldN("Genre"),
     vl.x().fieldQ("EU_Sales").aggregate("sum").scale({ domain: [0, 900] }),
     vl.tooltip().fieldQ('EU_Sales').aggregate('sum')
     
 )
   .width(200) // Adjust width for each column
   .height(400)
   .toSpec();

 vegaEmbed("#view4_2", vlSpec).then((result) => {
   const view = result.view;
   view.run();
   });
 }

 async function render4_3() {
    // Load data
   const data = await d3.csv("videogames_wide.csv");

   const vlSpec = vl
   .markBar() 
   .data(data)
   
   .encode(
     vl.y().fieldN("Genre"),
     vl.x().fieldQ("JP_Sales").aggregate("sum").scale({ domain: [0, 900] }),
     vl.tooltip().fieldQ('JP_Sales').aggregate('sum')
 )
   .width(200) // Adjust width for each column
   .height(400)
   .toSpec();

 vegaEmbed("#view4_3", vlSpec).then((result) => {
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
 render3_1();
 render3_2();
 render3_3();
 render3_4();

 //vis4
 render4_1();
 render4_2();
 render4_3();
