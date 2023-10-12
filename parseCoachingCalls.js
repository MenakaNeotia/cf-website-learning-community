const matter = require('gray-matter');
const fs = require('fs-extra');
const glob = require("glob");
const path = require("path");

// Get all mdx files that don't start with _
glob("resources/recordings-coaching-calls/[!_]*.mdx", function (err, files) {
  if(err) {
    console.log("Error finding files: " + err)
  } else {
    let dataArr = [];
    
    // Loop through each file
    for(let i=0; i<files.length; i++) {
	 

      // Read file as string
      const fileContent = fs.readFileSync(files[i], 'utf8');

      // Parse frontmatter from string 
      const result = matter(fileContent);

	  console.log(path.basename(files[i]))
	  console.log(result.data.coach.toLowerCase())
	  
		let previewPath = `/img/showcase/${result.data.coach_lower_case}-cf-coaching-call.png`;
		console.log(previewPath.substring(1))

	// Check if file exists, otherwise use generic image
	if (!fs.existsSync('static' + previewPath)) {
		console.log('TRUE')
		  previewPath = '/img/showcase/generic-cf-coaching-call.png';
		}

      // Create a new object based on parsed frontmatter and filename.
      let newDataObj ={
        title: result.data.title,
        date: result.data.date,
        description: result.data.description,
        tags: result.data.tags || [],
        
        preview: previewPath,
        
        website:`/resources/recordings-coaching-calls/${path.basename(files[i], '.mdx')}`,
        
        source:`/resources/recordings-coaching-calls/${path.basename(files[i], '.mdx')}`
       }

       dataArr.push(newDataObj);
      
    }

    // Write JSON output to disk at /src/data/coachingCalls/
    fs.writeJson('src/data/coachingCalls.json', dataArr);
  }
});
