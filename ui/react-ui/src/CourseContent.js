import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActionArea from '@mui/material/CardActionArea';
import DoneIcon from '@mui/icons-material/Done';
import LinearProgress from '@mui/material/LinearProgress';

const COMMON_TITLE = 'Security Courses';
const COMMON_ABSTRACT = 'Choose your specialization';

function CourseContent() {
    const [content, setContent] = useState([]);
    const [title, setTitle] = useState(COMMON_TITLE);
    const [abstract, setAbstract] = useState(COMMON_ABSTRACT);

    const navigate = useNavigate();
    const { courseSlug } = useParams();

    useEffect(() => {
        if (courseSlug) {
            fetch(`/api/courses/${courseSlug}`)
                .then((res) => res.json())
                .then((course) => {
                    setTitle(course.title);
                    setAbstract(course.abstract);
                });

            fetch(`/api/courses/${courseSlug}/lessons`)
                .then((res) => res.json())
                .then(setContent);
        } else {
            setTitle(COMMON_TITLE);
            setAbstract(COMMON_ABSTRACT);

            fetch('/api/courses/')
                .then((res) => res.json())
                .then(setContent);
        }
    }, [courseSlug]);

    const handleClick = (course) => {
        if (courseSlug) {
            navigate(`/courses/${courseSlug}/${course.slug}`);
        } else {
            navigate(`/courses/${course.slug}`);
        }
    };

    return (
        <div>
            <Container maxWidth="sm">
                <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h5" align="center" color="textSecondary" paragraph>
                    {abstract}
                </Typography>
            </Container>

            <Container maxWidth="md">
                <Grid container spacing={4}>
                    {content.map(course => (
                        <Grid item key={course.slug} xs={12} sm={6} md={4}>
                            <Card>
                                <CardActionArea onClick={() => handleClick(course)}>
                                    <CardMedia
                                        image={`/api/${course.logo}`}
                                        title={course.title}
                                        style={{ height: 256 }}
                                    />
                                    <CardContent style={{ height: 120 }}>
                                        <Typography gutterBottom variant="h5">
                                            {course.title} {course.solved && <DoneIcon />}
                                        </Typography>
                                        <Typography>{course.abstract}</Typography>
                                    </CardContent>
                                    <CardContent>
                                        <LinearProgress variant="determinate" value={course.progress} />
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </div>
    );
}

export default CourseContent;
