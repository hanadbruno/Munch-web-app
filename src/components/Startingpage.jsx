import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Box } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  startingPage: {
    height: '100vh',
  },
  pageTitle: {
    marginBottom: theme.spacing(2),
  },
}));

const Startingpage = () => {
  const classes = useStyles();
  const [inputValue, setInputValue] = useState('');

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle the submitted value
    console.log(inputValue);
    // Reset the input field
    setInputValue('');
  };

  return (
    <Grid
      container
      className={classes.startingPage}
      direction="column"
      justify="center"
      alignItems="center"
    >
      <Grid item>
        <Typography variant="h4" className={classes.pageTitle}>
          MyMunch
        </Typography>
      </Grid>
      <Grid item>
        <form onSubmit={handleSubmit}>
          <Grid container alignItems="center">
            <Grid item>
              <TextField
                type="text"
                value={inputValue}
                onChange={handleChange}
                placeholder="NAVN"
                variant="outlined"
              />
              
            </Grid>
            
          </Grid>
        </form>
        <Grid item>
        <Box textAlign='center'>
  <Button variant='contained'>
     START2
  </Button>
</Box>
            </Grid>
      </Grid>
    </Grid>
  );
};

export default Startingpage;
