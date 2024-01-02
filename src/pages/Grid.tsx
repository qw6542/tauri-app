import { invoke } from "@tauri-apps/api/tauri";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useEffect, useState } from "react";

export const MyGrid = () => {
    const [posts, setPosts] = useState([{
        id: "",
        title:"",
        text:"",
    }]);

    async function listPosts() {
      const posts:any = await invoke("list_posts_in_page", {
        pageSize: 5,
        page:0
      });
      setPosts(JSON.parse(posts));
     }
  
    useEffect(() => {
       listPosts();
    },[]);

  return (
<Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
{posts.map((post, index) => (
  <Grid item xs={2} sm={4} md={4} key={index}>
   <Card sx={{ maxWidth: 345 }}>
      <CardActionArea>
        <CardMedia
          component="img"
          height="140"
          image="/src/assets/react.svg"
          alt="green iguana"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
          { post.title }
          </Typography>
          <Typography variant="body2" color="text.secondary">
          { post.text }
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  </Grid>
))}
</Grid>
  );
}