import express from 'express';
import axios from 'axios';

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.static("public"));
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Define the POST request configuration function
const randomNumber = Math.floor(Math.random() * (10 - 3 + 1) ) + 3;

const getRecipes = async (requestBody) => {
    const config = {
        method: 'post',
        url: `https://apis-new.foodoscope.com/recipe-search/recipesAdvanced?page=${randomNumber}&pageSize=5`,
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer EoWffgcSRvUdVZ5jXrh7EDHzgEc2XNY7Bm7TFgpignjSxnE8',
          'Content-Type': 'application/json'
        },
        data: requestBody
      };

  try {
    // Send the POST request to fetch recipes
    const response = await axios(config);
    return response.data.payload.data;
  } catch (error) {
    console.error('Error fetching recipes:', error);
    throw new Error('Error fetching recipes');
  }
};

// const getRecipes2 = async () => {
//     const config = {
//         method: 'post',
//         url: `https://apis-new.foodoscope.com/recipe-search/recipesAdvanced?page=${randomNumber}&pageSize=5`,
//         headers: {
//           'Accept': 'application/json',
//           'Authorization': 'Bearer EoWffgcSRvUdVZ5jXrh7EDHzgEc2XNY7Bm7TFgpignjSxnE8',
//           'Content-Type': 'application/json'
//         },
//         data: requestBody
//       };

//   try {
//     // Send the POST request to fetch recipes
//     const response = await axios(config);
//     return response.data.payload.data;
//   } catch (error) {
//     console.error('Error fetching recipes:', error);
//     throw new Error('Error fetching recipes');
//   }
// };

// Route handler for serving the form
app.get('/', (req, res) => {
  res.render("main.ejs");
});
app.get('/nutriplan', (req, res) => {
  res.render("index.ejs");
});

app.get('/about', (req, res) => {
  res.render("about.ejs");
})
// Route handler for form submission
app.post('/post', async (req, res) => {
  const requestBody = req.body;

  try {
    const recipes = await getRecipes(requestBody);
    res.render("reciepe.ejs", { data: recipes });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching recipes' });
  }
});

// Route handler for cheat day
app.post('/cheatday', async (req, res) => {
  try {
    const response = await axios.get('https://apis-new.foodoscope.com/recipe/recipeOftheDay', {
      headers: {
        'Authorization': 'Bearer EoWffgcSRvUdVZ5jXrh7EDHzgEc2XNY7Bm7TFgpignjSxnE8'
      }
    });
    const cheatRecipe = response.data.payload;
    // console.log(cheatRecipe);
    res.render("cheatday.ejs", { recipe: cheatRecipe });
  } catch (error) {
    console.error('Error fetching cheat day recipe:', error);
    res.status(500).json({ error: 'Error fetching cheat day recipe' });
  }
console.log("cheat day")
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
