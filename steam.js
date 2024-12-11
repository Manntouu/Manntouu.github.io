const data = await d3.csv("dataset/1500 games.csv");
/////////////////////Vis 1a: Revenue by publisher class//////////////
async function renderFirstVis1() {
    console.log(data);
    // Aggregate data to calculate the sum of revenue for each publisher class
    const revenueByPublisherClass = d3.rollup(
      data,
      (v) => d3.sum(v, (d) => parseFloat(d.revenue)),
      (d) => d.publisherClass
    );
   
   
    // Flatten the aggregated data into an array
    const formattedData = Array.from(revenueByPublisherClass, ([key, value]) => ({
      publisherClass: key,
      revenue: value,
    }));
   
   
    // Create an array of blocks where each block represents a fixed revenue (e.g., 10M)
    const blocks = [];
    formattedData.forEach((d) => {
      const numBlocks = Math.floor(d.revenue / 10000000); // Each block represents 10M
      for (let i = 0; i < numBlocks; i++) {
        blocks.push({
          publisherClass: d.publisherClass,
          blockNumber: i, // Block index
        });
      }
    });
   
   
    // Set up the SVG canvas dimensions
    const blockWidth = 10; // Width of each block
    const blockHeight = 30; // Height of each block
    const gridColumns = 20; // Number of blocks per row
    const margin = { top: 10, right: 20, bottom: 60, left: 10 };
    const width = 1200;
    const height = 400;
   
   
    // Create scales
    const xScale = d3.scaleBand()
      .domain(["AAA", "AA", "Indie"])
      .range([margin.left, width - margin.right])
      .padding(0.5); // Space between groups
   
   
    const colorScale = d3.scaleOrdinal()
      .domain([...new Set(blocks.map((d) => d.publisherClass))])
      .range(["#f2f2f1", "#5d6169", "#c6c1bb"]); // Example colors for classes
   
   
    // Create the SVG container
    const svg = d3.select("#view1a")
      .append("svg")
      .attr("width", width)
      .attr("height", height);
   
   
    // Draw rectangles for each block
    svg.selectAll("rect")
      .data(blocks)
      .join("rect")
      .attr("x", (d) => {
        const groupX = xScale(d.publisherClass);
        const colIndex = d.blockNumber % gridColumns; // Column within the grid
        return groupX + colIndex * (blockWidth + 5); // Add spacing between columns
      })
      .attr("y", (d) => {
        const rowIndex = Math.floor(d.blockNumber / gridColumns); // Row within the grid
        return height - margin.bottom - (rowIndex + 1) * (blockHeight + 5); // Stack blocks bottom-to-top
      })
      .attr("width", blockWidth)
      .attr("height", blockHeight)
      .attr("fill", (d) => colorScale(d.publisherClass))
      .attr("stroke", "#000") // Optional: Add a border for visibility
      .attr("stroke-width", 0.5);
   
   
    // Add labels for publisher classes on the x-axis
    svg.selectAll(".publisher-label")
      .data([...new Set(blocks.map((d) => d.publisherClass))])
      .join("text")
      .attr("x", (d) => xScale(d) + xScale.bandwidth() / 2)
      .attr("y", height - margin.bottom + 30)
      .attr("text-anchor", "middle")
      .attr("fill", "#fff")
      .text((d) => d);
   }

///////////////Page 3 , vis 2345//////////////////////
async function render4Visualizations() {
    // Calculate averages for playtime, price, and reviewScore by publisherClass
    const aggregateData = d3.groups(data, d => d.publisherClass)
      .map(([publisherClass, values]) => ({
        publisherClass,
        avgPlaytime: d3.mean(values, d => +d.avgPlaytime),
        avgPrice: d3.mean(values, d => +d.price),
        avgReviewScore: d3.mean(values, d => +d.reviewScore)
      }));
   
   
    /////////1 Avg Playtime Visualization/////////////
    const baseChartPlaytime = vl
      .markBar({ color: '#C0C0C0' })
      .data(aggregateData)
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 , grid: false}),
        vl.y().fieldQ('avgPlaytime').axis({grid: false}).title('Average Playtime (hours)')
      );
   
   
    const avgBarsPlaytime = vl
      .markBar({ color: '#5d6169' })
      .data(aggregateData)
      .transform(
        vl.filter("datum.avgPlaytime >= 13.44"),
        vl.calculate("13.44").as("baseline")
      )
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 ,grid: false}),
        vl.y().fieldQ('baseline').axis({grid: false}),
        vl.y2().fieldQ('avgPlaytime')
      );
   
   
      const avgLinePlaytime = vl
        .markRule({ color: 'black', strokeWidth: 1, strokeDash: [4, 4] }) // Dashed line with 4px dash and 4px gap
        .data([{ y: 13.44 }])
        .encode(vl.y().datum(13.44).title('Avg Threshold'));

   const annotationPlaytimeText = vl
      .markText({
        align: "left", // Align the text to the left
        baseline: "middle", // Vertically align the text
        dx: 30, // Offset to the right
        dy: 8, // Offset above the graph
        fontSize: 11, // Font size for readability
        fontWeight: "bold", // Bold for emphasis
        color: "#000" // Black text color
      })
      .data([{ publisherClass: "AAA", avgPlaytime: 15 }]) // Position the annotation near AAA
      .encode(
        vl.x().datum("Indie"), // Place annotation near the AAA category
        vl.y().datum(15), // Place annotation near the 15 y-value
        vl.text().value("AVG.")
      );

    const textLabels = vl
      .markText({
        align: 'center', // Align text in the center of each bar
        baseline: 'middle', // Align text vertically to the middle of the bar
        dy: -7, // Adjust the vertical position to appear above the bar
        fontSize: 12, // Set the font size
        fontWeight: 'bold', // Optional: Make text bold
        color: 'black', // Text color
      })
      .data(aggregateData)
      .encode(
        vl.x()
          .fieldN('publisherClass')
          .sort(['AAA', 'AA', 'Indie'])
          .scale({ paddingInner: 0.5, paddingOuter: 0.2 }),
        vl.y().fieldQ('avgPlaytime'),
        vl.text().fieldQ('avgPlaytime').format('d') // Format to two decimal places
      );   

      //Display 1st visualization end//
      const playtimeSpec = vl
      .layer(baseChartPlaytime, avgBarsPlaytime, avgLinePlaytime, annotationPlaytimeText, textLabels)
      .width(400)
      .toSpec();
   
   
    //////////2 Avg Price Visualization///////////
    const baseChartPrice = vl
      .markBar({ color: '#C0C0C0' })
      .data(aggregateData)
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0, grid: false }),
        vl.y().fieldQ('avgPrice').axis({grid: false}).title('Average Price ($)')
      );
   
   
    const avgBarsPrice = vl
      .markBar({ color: '#5d6169' })
      .data(aggregateData)
      .transform(
        vl.filter("datum.avgPrice >= 17.52"),
        vl.calculate("17.52").as("baseline")
      )
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0, grid: false }),
        vl.y().fieldQ('baseline').axis({grid: false}),
        vl.y2().fieldQ('avgPrice')
      );
   
   
      const avgLinePrice = vl
      .markRule({ color: 'black', strokeWidth: 1 ,strokeDash: [4, 4]})
      .data([{ y: 17.52 }])
      .encode(vl.y().datum(17.52).title('Avg Threshold'));
   
   //Add text labels
      const annotationPriceText = vl
      .markText({
        align: "left", // Align the text to the left
        baseline: "middle", // Vertically align the text
        dx: 30, // Offset to the right
        dy: 8, // Offset above the graph
        fontSize: 11, // Font size for readability
        fontWeight: "bold", // Bold for emphasis
        color: "#000" // Black text color
      })
      .data([{ publisherClass: "AAA", avgPlaytime: 15 }]) // Position the annotation near AAA
      .encode(
        vl.x().datum("Indie"),
        vl.y().datum(20),
        vl.text().value("AVG.")
      );


    const textLabels_price = vl
      .markText({
        align: 'center', // Align text in the center of each bar
        baseline: 'middle', // Align text vertically to the middle of the bar
        dy: -5, // Adjust the vertical position to appear above the bar
        fontSize: 12, // Set the font size
        fontWeight: 'bold', // Optional: Make text bold
        color: 'black', // Text color
      })
      .data(aggregateData)
      .encode(
        vl.x()
          .fieldN('publisherClass')
          .sort(['AAA', 'AA', 'Indie'])
          .scale({ paddingInner: 0.5, paddingOuter: 0.2 }),
        vl.y().fieldQ('avgPrice'),
        vl.text().fieldQ('avgPrice').format('d') // Format to two decimal places
      );

      //Display 2nd visualization end//
      const priceSpec = vl
      .layer(baseChartPrice, avgBarsPrice, avgLinePrice, annotationPriceText, textLabels_price)
      .width(400)
      .toSpec();
   
   
    ////////////3 Avg Review Score Visualization/////////////////
    const baseChartReview = vl
      .markBar({ color: '#C0C0C0' })
      .data(aggregateData)
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0, grid: false }),
        vl.y().fieldQ('avgReviewScore').axis({grid: false})
      );

      const textLabels_reviewScore = vl
        .markText({
          align: 'center', // Align text in the center of each bar
          baseline: 'middle', // Align text vertically to the middle of the bar
          dy: -5, // Adjust the vertical position to appear above the bar
          fontSize: 12, // Set the font size
          fontWeight: 'bold', // Optional: Make text bold
          color: 'black', // Text color
        })
        .data(aggregateData)
        .encode(
          vl.x()
            .fieldN('publisherClass')
            .sort(['AAA', 'AA', 'Indie'])
            .scale({ paddingInner: 0.5, paddingOuter: 0.2 }),
          vl.y().fieldQ('avgReviewScore'),
          vl.text().fieldQ('avgReviewScore').format('d')
        );

      const reviewScoreSpec = vl
      .layer(baseChartReview, textLabels_reviewScore)
      .width(400)
      .toSpec();
   
   
    /////////4 Pie chart: Game released by publisher class////////////
    // Step 1: Aggregate data to count games by publisherClass
    const countData = d3.groups(data, d => d.publisherClass)
      .map(([publisherClass, values]) => ({
        publisherClass,
        count: values.length // Count of games for each publisherClass
      }));
   
   
    // Step 2: Create the pie chart specification
    const gamePublishedSpec = vl
      .layer(
        // Layer 1: Arc (Pie chart)
        vl.markArc({ outerRadius: 80 })
          .data(countData)
          .encode(
            vl.theta().fieldQ("count").stack(true), // Angle based on game count
            vl.color().fieldN("publisherClass").type("nominal").legend(null)
            .scale({
              domain: ["AA", "AAA", "Indie"], // Specify the domain (categories)
              range: ["#bdbeba", "#efe5cc", "#5d6169"] // Specify the custom colors
            })
          ),
   
   
        // Layer 2: Text (Labels)
        vl.markText({ radius: 100 }) // Offset labels outside arcs
          .data(countData)
          .transform(
            vl.calculate("datum.publisherClass + ': ' + datum.count").as("label") // Concatenate category and value
          )
          .encode(
            vl.theta().fieldQ("count").stack(true), // Angle for label position
            vl.text().fieldN("label"), // Display count of games as text
            vl.color().fieldN("publisherClass").title("Publisher Class")
         
          )
      )
      .width(400)
      .height(250)
      .toSpec();
   
   
    // Embed visualizations in respective divs
    
   vegaEmbed("#vis1", playtimeSpec, { actions: false });
   vegaEmbed("#vis2", priceSpec, { actions: false });
   vegaEmbed("#vis3", reviewScoreSpec, { actions: false });
   vegaEmbed("#vis4", gamePublishedSpec, { actions: false });
  }


   async function render2PriceBin() {
    // Chart 1: Price Bin vs Number of Games Published
    const priceBinGameCountSpec = vl
      .layer(
        // Bar chart
        vl.markBar()
          .data(data)
          .encode(
            vl.y().fieldQ('price').bin({ step: 10 }).title('Price Bin ($)'), // Bin prices
            vl.x().fieldQ('count').aggregate('count').axis({ tickCount: 7, tickStep: 20, grid: false }).title('Number of Games Published'), // Count games
            vl.color().value('#bdbeba') // Set color
          ),
        // Text labels
        vl.markText({
          align: 'left',
          baseline: 'middle',
          dx: 3, // Center the text on the bar
          dy: 0, // Position above the bar
          fontSize: 12,
          fontWeight: 'bold',
          color: 'black',
        })
          .data(data)
          .encode(
            vl.y().fieldQ('price').bin({ step: 10 }),
            vl.x().fieldQ('count').aggregate('count'),
            vl.text().fieldQ('count').aggregate('count').format('d') // Format as integers
          )
      )
      .width(400)
      .height(300)
      .toSpec();


     // Embed Chart 1
    vegaEmbed('#priceBinChart1', priceBinGameCountSpec, { actions: false });
  }

   ////////vis 8/////////////////////////
   let tooltipTimeout;
   async function renderBlockVisualization() {
     const publisherColors = {
         Indie: "#FFFACD",
         AA: "#AFEEEE",   
         AAA: "#808080"   
       };
     // Step 1: Process top 100 games by review score
     const top100Games = data
       .sort((a, b) => d3.descending(+a.reviewScore, +b.reviewScore))
       .slice(0, 100);
  
  
       console.log("Top 100 Games:", top100Games);
     // Step 2: Aggregate by publisher class
     const aggregatedData = d3.groups(top100Games, d => d.publisherClass)
       .map(([publisherClass, values]) => ({
         publisherClass,
         avgReviewScore: d3.mean(values, d => +d.reviewScore),
         count: values.length
       }));
   
     // Dimensions
     const margin = { top: 20, right: 150, bottom: 40, left: 40 };
     const width = 800;
     const height = 400;
     const blockSize = 30; // Size of each block
     const blockSpacing = 0; // Space between blocks (reduce this value)
     const totalColumns = 10; // Total columns in the rectangle
      // Compute the total number of blocks
     const totalBlocks = aggregatedData.reduce((sum, d) => sum + d.count, 0);
     const totalRows = Math.ceil(totalBlocks / totalColumns);
      // xScale: Maps column indices to x positions
     const xScale = d3.scaleLinear()
       .domain([0, totalColumns])
       .range([margin.left, width - margin.right- 230]);
      // yScale: Maps row indices to y positions
     const yScale = d3.scaleLinear()
       .domain([0, totalRows])
       .range([margin.top, height - margin.bottom]);
      // SVG Container
     const svg = d3.select("#blockVisualization")
       .append("svg")
       .attr("width", width)
       .attr("height", height)
       .style("background-color", "#000")
       .style("margin", "0") // Ensure no margin
        .style("padding", "0");

      
      svg.selectAll("rect")
     .data(top100Games)
     .join("rect")
     .attr("x", (d, i) => xScale(i % totalColumns))
     .attr("y", (d, i) => yScale(Math.floor(i / totalColumns)))
     .attr("width", blockSize)
     .attr("height", blockSize)
     .attr("fill", (d) => publisherColors[d.publisherClass] || "#fff")
     .attr("stroke", "#000")
     .attr("stroke-width", 0.5)
     .each(function () {
        const rect = d3.select(this);
        if (!rect.attr("data-original-x")) {
            rect.attr("data-original-x", rect.attr("x"))
                .attr("data-original-y", rect.attr("y"));
        }
    })
     .on("mouseover", function(event, d){
         clearTimeout(tooltipTimeout); // Clear any previous timeouts
         const isSmallScreen = window.innerWidth <= 768;
         const tooltip = document.querySelector("#tooltip");
         const infoSection = document.querySelector("#info-section");
         // Store the original attributes in the dataset of the element
         const rect = d3.select(this);

         // Make the block white and bigger
         rect.interrupt();
         rect.transition()
             .duration(150)
             .attr("fill", "#DC143C")
             .attr("width", +blockSize + 8) // Slightly bigger
             .attr("height", +blockSize + 8)
             .attr("x", +rect.attr("data-original-x") - 4) // Adjust position to keep centered
             .attr("y", +rect.attr("data-original-y") - 4);
  
  
         if (isSmallScreen) {
             // Show tooltip for small screens
             tooltip.innerHTML = `
                         <p><strong>${d.name || "N/A"}</strong></p>
                         <p>Review Score: ${d.reviewScore || "N/A"}</p>
                         <p>Release Date: ${d.releaseDate || "N/A"}</p>
                         <p>Price: $${d.price || "0.00"}</p>
                         <p>Copies Sold: ${d.copiesSold || "N/A"}</p>
                         <p>Avg Playtime: ${parseFloat(d.avgPlaytime || 0).toFixed(1)} hours</p>
                         <p>Publisher: ${d.publishers || "N/A"}</p>
                         <div style="display: flex; align-items: center; gap: 10px;">
                     <img src="dataset/gameIcon/${d.steamId}.jpg" alt="${d.name}" style="max-width: 300px; max-height: 200px; border: 1px solid #ccc; border-radius: 5px;">
                     <div>
                     </div>
                 </div>
             `;
             tooltip.style.display = "block"; // Show tooltip
             tooltip.style.opacity = 0; // Start hidden
             tooltip.style.transform = "translateY(10px)";
             setTimeout(() => {
                 tooltip.style.opacity = 1;
                 tooltip.style.transform = "translateY(0)";
             }, 150);
             tooltip.style.left = `${event.pageX + 10}px`;
             tooltip.style.top = `${event.pageY + 10}px`;
         } else {
             //Add easing effect for the info section
             infoSection.style.transition = "opacity 0.2s ease-in-out, transform 0.2s ease-in-out";
             infoSection.style.opacity = 0;
             infoSection.style.transform = "translateY(10px)";
             setTimeout(() => {
                 infoSection.classList.add("visible");
                 updateInfoContent(d);
                 infoSection.style.opacity = 1;
                 infoSection.style.transform = "translateY(0)";
             }, 300);
         }
     })
     .on("mousemove", (event) => {
         // Dynamically position tooltip
         const isSmallScreen = window.innerWidth <= 768;
         if (isSmallScreen) {
             const tooltip = document.querySelector("#tooltip");
             tooltip.style.left = `${event.pageX + 10}px`;
             tooltip.style.top = `${event.pageY + 10}px`;
         }w
     })
     .on("mouseout", function() {
         const isSmallScreen = window.innerWidth <= 768;
         const infoSection = document.querySelector("#info-section");
  
         const rect = d3.select(this); 
         rect.interrupt();
         // Restore the original attributes
         rect.transition()
             .duration(150)
             .attr("fill", (d) => publisherColors[d.publisherClass] || "#fff")
             .attr("width", blockSize)
             .attr("height", blockSize)
             .attr("x", rect.attr("data-original-x"))
             .attr("y", rect.attr("data-original-y"));
            
         if (isSmallScreen) {
             clearTimeout(tooltipTimeout); // Clear any previous timeouts
             tooltipTimeout = setTimeout(() => {
                 const tooltip = document.querySelector("#tooltip");
                 tooltip.style.opacity = 0;
                 tooltip.style.transform = "translateY(10px)";
                 setTimeout(() => {
                     tooltip.style.display = "none";
                 }, 150);
             }, 150);
         } else {
             infoSection.style.transition = "opacity 0.2s ease-in-out, transform 0.2s ease-in-out";
                     infoSection.style.opacity = 0;
                     infoSection.style.transform = "translateY(10px)";
  
  
                     setTimeout(() => {
                         infoSection.classList.remove("visible");
                     }, 300);
         }
     });
      
 
  
  
   // Add Tooltip Div
   d3.select("body").append("div")
     .attr("id", "tooltip")
     .style("position", "absolute")
     .style("background-color", "#fff")
     .style("color", "#000")
     .style("padding", "10px")
     .style("border", "1px solid #ccc")
     .style("border-radius", "5px")
     .style("opacity", 0);
  }
  // Helper function to update the info section content
  function updateInfoContent(d) {
     document.querySelector(".game-name").textContent = d.name || "N/A";
     document.querySelector(".game-review-score").textContent = d.reviewScore || "N/A";
     document.querySelector(".game-release-date").textContent = d.releaseDate || "N/A";
     document.querySelector(".game-price").textContent = `$${d.price || "0.00"}`;
     document.querySelector(".game-copies-sold").textContent = d.copiesSold || "N/A";
     document.querySelector(".game-playtime").textContent = `${parseFloat(d.avgPlaytime || 0).toFixed(1)} hours`;
     document.querySelector(".game-publisher").textContent = d.publishers || "N/A";
  
  
     const gameIcon = document.querySelector(".game-icon");
     gameIcon.src = `dataset/gameIcon/${d.steamId}.jpg`;
     gameIcon.alt = d.name || "Game Icon";
     gameIcon.style.maxWidth = "800px"; // Restrict max width to 500px
    gameIcon.style.height = "auto";  
     gameIcon.onerror = () => {
         gameIcon.src = "dataset/gameIcon/default.jpg";
     };
    }
 
 
  
   
   renderFirstVis1();
   render4Visualizations();

   render2PriceBin();
 renderBlockVisualization();

   
   