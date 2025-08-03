import React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import DoneIcon from '@mui/icons-material/Done';
import { Link as RouterLink } from 'react-router-dom';

const COMMON_TITLE = 'Statistics';
const COMMON_ABSTRACT = 'All courses';

class Statistics extends React.Component {

    constructor() {
        super();
        this.state = {
            'title': 'Security Courses',
            'abstract': 'Choose your specialization',
            'header': [],
            'content': [],
            'hasCourseSlug': false,
        }
    }

    fetchStatistics(courseSlug = '') {
        if (courseSlug) {
            fetch('/api/courses/' + courseSlug).then(function (response) {
                return response.json();
            }).then(
                course => {
                    this.setState({ 'title': COMMON_TITLE, 'abstract': course.title });
                });
            fetch('/api/statistics/courses/' + courseSlug).then(function (response) {
                return response.json();
            }).then(statistics => {
                this.setState({
                    'hasCourseSlug': true,
                    'header': statistics['statistics_header'],
                    'content': statistics['statistics_content']
                });
            });
        } else {
            this.setState({ 'title': COMMON_TITLE, 'abstract': COMMON_ABSTRACT });
            fetch('/api/statistics').then(function (response) {
                return response.json();
            }).then(statistics => {
                this.setState({
                    'hasCourseSlug': false,
                    'header': statistics['statistics_header'],
                    'content': statistics['statistics_content']
                });
            });
        }
    }

    componentDidMount() {
        const { params } = this.props;

        if (params && params.courseSlug) {
            this.fetchStatistics(params.courseSlug);
        } else {
            this.fetchStatistics();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (prevProps.params.courseSlug !== this.props.params.courseSlug) {
            if (this.props.params.courseSlug) {
                this.fetchStatistics(this.props.params.courseSlug);
            } else {
                this.fetchStatistics();
            }
        }
    }

    render() {
        return (
            <div>
                <div>
                    <Container maxWidth="sm">
                        <Typography component="h1" variant="h2" align="center" color="textPrimary" gutterBottom>
                            {this.state.title}
                        </Typography>
                        <Typography variant="h5" align="center" color="textSecondary" paragraph>
                            {this.state.abstract}
                        </Typography>
                    </Container>
                </div>
                <Container maxWidth="md">
                    <Table size="small">
                        <TableHead>
                            <TableRow>
                                <TableCell>Username</TableCell>
                                {
                                    this.state.header.map(header => (
                                        <TableCell align="right">
                                            {
                                                (this.state.hasCourseSlug)
                                                    ? header['title']
                                                    : <RouterLink to={'/statistics/' + header['slug']}>{header['title']}</RouterLink>
                                            }
                                        </TableCell>
                                    ))
                                }
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {this.state.content.map(row => (
                                <TableRow key={row.uid}>
                                    <TableCell component="th" scope="row">{row.username}</TableCell>
                                    {
                                        (this.state.hasCourseSlug)
                                            ? this.state.header.map(lesson => (
                                                <TableCell align="right">
                                                    {
                                                        (row.lessons[lesson['slug']].progress)
                                                        && <DoneIcon />
                                                    }
                                                </TableCell>
                                            ))
                                            : this.state.header.map(course => (
                                                <TableCell align="right">
                                                    {(row.courses[course['slug']].progress)}&nbsp;%
                                                </TableCell>
                                            ))
                                    }
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Container>
            </div>
        );
    }
}

export default Statistics;