import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import SettingsIcon from '@material-ui/icons/Settings';
import ProfileImage from '../assets/svg/ss/man.svg';
import Image from '../assets/Images/Picture.jpg';
import Image2 from '../assets/Images/gamingIndustry.png';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import ReactPlayer from 'react-player'

const useStyles = makeStyles((theme) => ({
  root: {
    width: 'calc(100%)',
    position: 'relative',
    top: '65px'
  },
  button: {
    marginTop: theme.spacing(1),
    marginRight: theme.spacing(1),
  },
  actionsContainer: {
    marginBottom: theme.spacing(2),
  },
  resetContainer: {
    padding: theme.spacing(3),
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

function getSteps() {
  return [
    { 'Name': 'Basavaraj Pujar', 'path': 'https://youtu.be/FV2tMP37ygs', 'text': 'Talking Tech and 2020 with Bill Gates!', 'date': '20 Oct 2020, 20:30' },
    { 'Name': 'Darshan Sonde', 'path': 'https://youtu.be/ux4R5GeKMUU', 'text': 'Talking Tech with Microsoft CEO Satya Nadella!', 'date': '20 Oct 2020, 19:30' },
    { 'Name': 'Darshan Sonde', 'src': Image, 'date': '20 Oct 2020, 12:20' },
    {
      'Name': 'Sushmeeta Patil', 'text': 'When one mentions the entertainment industry, most people would think about films and music. Of course, there is a lot of glitz and glamour in the film and music industries. But would you be surprised to learn that these two are not the top-grossing sectors in entertainment? \
    Here is the graph shows the revenue made in 2019. This is real global data. You see the size of mobile gaming is growing and growing every year. And now mobile gaming is along bigger than all your bollywood, holloywood, tollywood, sandalwood etc… \
    That the kind of revenues and growth can be expected here in gaming market.', 'date': '20 Oct 2020, 13:20'
    },
    { 'Name': 'Darshan Sonde', 'src': Image2, 'date': '20 Oct 2020, 9:20' }];
}

export default function EventFeed() {
  const classes = useStyles();
  const steps = getSteps();

  const [expanded, setExpanded] = React.useState(false);

  const handleExpandClick = (index) => {
    // setExpanded(steps);
    setExpanded(!expanded);
  };

  return (
    <div className={classes.root}>
      <Stepper orientation="vertical">
        {steps.map((label, index) => (

          <Step key={index} expanded>
            <StepLabel icon={<SettingsIcon />}>
              <div style={{ display: 'flex', alignItems: 'center', color: 'black', position: 'relative' }}>
                <hr style={{ width: '30px', margin: '10px' }} />
                <img src={ProfileImage} width='30' alt="" style={{ 'marginRight': '10px' }} />
                <span>{label.Name}</span>
                <p style={{ position: 'absolute', right: '0px', marginRight: '12px' }}>{label.date}</p>
              </div>
            </StepLabel>
            <StepContent>
              <Card>
                {label.src &&
                  <CardMedia
                    className={classes.media}
                    image={label.src}
                    title="Image"
                  />}
                {label.path &&
                  <ReactPlayer
                    url={label.path}
                    controls
                    // playbackRate={2}
                    className={classes.player}
                    width="100%"
                    height="40vw"
                  />}
                <CardContent>
                  {label.text &&
                    <Typography variant="body2" color="textSecondary" component="p">
                      {label.text}
                    </Typography>
                  }
                </CardContent>
                <CardActions disableSpacing>
                  <IconButton aria-label="add to favorites">
                    <FavoriteIcon />
                  </IconButton>
                  <IconButton aria-label="share">
                    <ShareIcon />
                  </IconButton>
                  {/* <IconButton
                    className={clsx(classes.expand, {
                      [classes.expandOpen]: expanded,
                    })}
                    onClick={() => handleExpandClick(index)}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </IconButton> */}
                </CardActions>
                {/* <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Comments</Typography>
                    <Typography paragraph>
                      Try out different ad text to see what brings in the most customers,
                      and learn how to enhance your ads using features like ad extensions.
                      If you run into any problems with your ads, find out how to tell if
                      they're running and how to resolve approval issues.
                  </Typography>
                  </CardContent>
                </Collapse> */}
              </Card>

            </StepContent>
          </Step>
        ))
        }


      </Stepper>

    </div>
  );
}


{/* {steps.map((label, index) => ( */ }
{/* <Step key={label} expanded>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              <Typography>{getStepContent(2)}</Typography>
            </StepContent>
          </Step> */}
{/* ))} */ }


{/* <img src={Image} width='100%' alt="" style={{ 'marginRight': '10px' }} />
              <Typography>For each ad campaign that you create, you can control how much
              you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.</Typography> */}



{/* <Step key={2} expanded>
          <StepLabel icon={<SettingsIcon />}>
            <div style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
              <hr style={{ width: '30px', margin: '10px' }} />
              <img src={ProfileImage} width='30' alt="" style={{ 'marginRight': '10px' }} />
              <span>SUSHMEETA PATIL</span>
            </div>
          </StepLabel>
          <StepContent>
            <Card>
              <ReactPlayer
                url="https://www.youtube.com/watch?v=ysz5S6PUM-U"
                controls
                playbackRate={2}
                className={classes.player}
                width="100%"
                height="40vw"
              />
              <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                  This impressive paella is a perfect party dish and a fun meal to cook together with your
                  guests. Add 1 cup of frozen peas along with the mussels, if you like.
                </Typography>
              </CardContent>
              <CardActions disableSpacing>
                <IconButton aria-label="add to favorites">
                  <FavoriteIcon />
                </IconButton>
                <IconButton aria-label="share">
                  <ShareIcon />
                </IconButton>
                <IconButton
                  className={clsx(classes.expand, {
                    [classes.expandOpen]: expanded,
                  })}
                  onClick={handleExpandClick}
                  aria-expanded={expanded}
                  aria-label="show more"
                >
                  <ExpandMoreIcon />
                </IconButton>
              </CardActions>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <CardContent>
                  <Typography paragraph>Comments</Typography>
                  <Typography paragraph>
                    Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                    minutes.
                  </Typography>
                </CardContent>
              </Collapse>
            </Card>

          </StepContent>
        </Step>

        <Step key={3} expanded>
          <StepLabel icon={<SettingsIcon />}>
            <div style={{ display: 'flex', alignItems: 'center', color: 'black' }}>
              <hr style={{ width: '30px', margin: '10px' }} />
              <img src={ProfileImage} width='30' alt="" style={{ 'marginRight': '10px' }} />
              <span>SUSHMEETA PATIL</span>
            </div>
          </StepLabel>
          <StepContent>
            <Typography>For each ad campaign that you create, you can control how much
            you're willing to spend on clicks and conversions, which networks
              and geographical locations you want your ads to show on, and more.</Typography>
          </StepContent>
        </Step> */}
