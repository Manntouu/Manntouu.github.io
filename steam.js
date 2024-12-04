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
   
   
    // Avg Playtime Visualization
    const baseChartPlaytime = vl
      .markBar({ color: '#C0C0C0' })
      .data(aggregateData)
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 }),
        vl.y().fieldQ('avgPlaytime')
      );
   
   
    const avgBarsPlaytime = vl
      .markBar({ color: '#e45755' })
      .data(aggregateData)
      .transform(
        vl.filter("datum.avgPlaytime >= 13.44"),
        vl.calculate("13.44").as("baseline")
      )
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 }),
        vl.y().fieldQ('baseline'),
        vl.y2().fieldQ('avgPlaytime')
      );
   
   
      const avgLinePlaytime = vl
      .markRule({ color: 'black', strokeWidth: 1 })
      .data([{ y: 13.44 }])
      .encode(vl.y().datum(13.44).title('Avg Threshold'));
   
   
      const playtimeSpec = vl
      .layer(baseChartPlaytime, avgBarsPlaytime, avgLinePlaytime)
      .width(400)
      .toSpec();
   
   
    // Avg Price Visualization
    const baseChartPrice = vl
      .markBar({ color: '#C0C0C0' })
      .data(aggregateData)
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 }),
        vl.y().fieldQ('avgPrice')
      );
   
   
    const avgBarsPrice = vl
      .markBar({ color: '#e45755' })
      .data(aggregateData)
      .transform(
        vl.filter("datum.avgPrice >= 17.52"),
        vl.calculate("17.52").as("baseline")
      )
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 }),
        vl.y().fieldQ('baseline'),
        vl.y2().fieldQ('avgPrice')
      );
   
   
      const avgLinePrice = vl
      .markRule({ color: 'black', strokeWidth: 1 })
      .data([{ y: 17.52 }])
      .encode(vl.y().datum(17.52).title('Avg Threshold'));
   
   
      const priceSpec = vl
      .layer(baseChartPrice, avgBarsPrice, avgLinePrice)
      .width(400)
      .toSpec();
   
   
    // Avg Review Score Visualization
    const baseChartReview = vl
      .markBar({ color: '#C0C0C0' })
      .data(aggregateData)
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 }),
        vl.y().fieldQ('avgReviewScore')
      );
   
   
    const avgBarsReview = vl
      .markBar({ color: '#e45755' })
      .data(aggregateData)
      .transform(
        vl.filter("datum.avgReviewScore >= 76.2"),
        vl.calculate("76.2").as("baseline")
      )
      .encode(
        vl.x().fieldN('publisherClass')
        .sort(['AAA', 'AA', 'Indie'])
        .scale({ paddingInner: 0.5, paddingOuter: 0.2 })
        .axis({ labelAngle: 0 }),
        vl.y().fieldQ('baseline'),
        vl.y2().fieldQ('avgReviewScore')
      );
   
   
      const avgLineReview = vl
      .markRule({ color: 'black', strokeWidth: 1 })
      .data([{ y: 76.2}])
      .encode(vl.y().datum(76.2).title('Avg Threshold'));
   
   
      const reviewScoreSpec = vl
      .layer(baseChartReview, avgBarsReview, avgLineReview)
      .width(400)
      .toSpec();
   
   
    // Game released by publisher class
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
    vegaEmbed("#vis1", playtimeSpec);
    vegaEmbed("#vis2", priceSpec);
    vegaEmbed("#vis3", reviewScoreSpec);
    vegaEmbed("#vis4", gamePublishedSpec);
   }

   async function render2PriceBin() {
    // Chart 1: Price Bin vs Number of Games Published
    const priceBinGameCountSpec = vl
      .markBar()
      .data(data)
      .encode(
        vl.y().fieldQ('price').bin({ step: 10 }).title('Price Bin ($)'), // Bin prices
        vl.x().fieldQ('count').aggregate('count').axis({ tickCount: 7, tickStep: 20 }).title('Number of Games Published'), // Count games
        vl.color().value('#bdbeba') // Set color
      )
      .width(400)
      .height(300)
      .toSpec();
     // Embed Chart 1
    vegaEmbed('#priceBinChart1', priceBinGameCountSpec);
     // Chart 2: Price Bin vs Average Copies Sold
    const priceBinCopiesSoldSpec = vl
      .markBar()
      .data(data)
      .encode(
        vl.y().fieldQ('price').bin({ step: 10 }).title('Price Bin ($)'), // Bin prices
        vl.x().fieldQ('copiesSold').aggregate('sum').title('Sum Copies Sold'), // Total copies sold
        vl.color().value('#5d6169') // Set color
      )
      .width(400)
      .height(300)
      .toSpec();
     // Embed Chart 2
    vegaEmbed('#priceBinChart2', priceBinCopiesSoldSpec);
  }
   ////////vis 8/////////////////////////
  async function renderBlockVisualization() {
    const publisherColors = {
        Indie: "#03396c",
        AA: "#00c2c7",   
        AAA: "#77ab59"   
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
    .on("mouseover", (event, d) => {
        // Show the info section and update its content
        const infoSection = document.querySelector("#info-section");
        infoSection.classList.add("visible");
   
        // Update text content
        document.querySelector(".game-name").textContent = d.name || "N/A";
        document.querySelector(".game-review-score").textContent = d.reviewScore || "N/A";
        document.querySelector(".game-release-date").textContent = d.releaseDate || "N/A";
        document.querySelector(".game-price").textContent = `$${d.price || "0.00"}`;
        document.querySelector(".game-copies-sold").textContent = d.copiesSold || "N/A";
        document.querySelector(".game-playtime").textContent = `${parseFloat(d.avgPlaytime || 0).toFixed(1)} hours`;
        document.querySelector(".game-publisher").textContent = d.publishers || "N/A";
   
        // Update the game icon
        const gameIcon = document.querySelector(".game-icon");
        gameIcon.src = `dataset/gameIcon/${d.steamId}.jpg`;
        gameIcon.alt = d.name || "Game Icon";
   
        // Handle missing images gracefully
        gameIcon.onerror = () => {
          gameIcon.src = "dataset/gameIcon/default.jpg";
        };
      })
    .on("mouseout", () => {
        document.querySelector("#info-section").classList.remove("visible");
      });
     
 svg.selectAll(".publisher-label")
    .data(aggregatedData)
    .join("text")
    .attr("x", width - margin.right - 200) // Place labels to the right of the blocks
    .attr("y", (d, i) => margin.top + 250 + i * 40) // Distribute labels vertically
    .attr("text-anchor", "start")
    .attr("fill", (d) => { return publisherColors[d.publisherClass] || "#fff"; // Default to white
    })
    .text(d => `${d.publisherClass}: ${d.count} games`);
 
 
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
 
 
  console.log("Rendered Blocks for Top 100 Games");
 }
 
 
  
   
   renderFirstVis1();
   render4Visualizations();

   render2PriceBin();
 renderBlockVisualization();

   
   