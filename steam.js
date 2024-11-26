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
  
   
   renderFirstVis1();
   render4Visualizations();

   
   