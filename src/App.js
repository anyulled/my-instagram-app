import React, {Component} from 'react';
import {
    Badge,
    Button,
    Col,
    Glyphicon,
    Grid,
    Image,
    Jumbotron,
    ListGroup,
    ListGroupItem,
    Navbar,
    Panel,
    ProgressBar,
    Row,
    Thumbnail
} from "react-bootstrap";
import {firebaseApp, firebaseAuth} from "./firebaseConfig";

const NET_DELAY = 300;
const instagramProvider = firebaseApp.autth.OAuthProvider("");

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            loggedIn: false,
            percentage: 0,
            lastPictureUrl: "",
            likes: [],
            user: {
                name: "",
                profilePic: ""
            }
        };
        const config = {
            apiKey: "AIzaSyAmEVco1bXR5DZ2ocOBh9gc46Uj19APfsI",
            authDomain: "instagram-liker.firebaseapp.com",
            projectId: "instagram-liker",
        };
    }

    loadData = () => {
        this.setState({
            loading: true,
            percentage: 100
        });
        setTimeout(() => {
            this.setState({
                loading: false,
                lastPictureUrl: "https://scontent-mad1-1.cdninstagram.com/vp/9532c28e2e7c99ff240c3bd694aa90ae/5B1ECCA3/t51.2885-15/e35/26225755_1160787804023893_6859265210700529664_n.jpg",
                likes: Array
                    .apply(null, {length: (Math.random() * 100)})
                    .map(Function.call, (index) => ({
                        id: Math.random(),
                        name: `User ${index}`
                    }))
            });
        }, NET_DELAY);
    };

    logIn = () => {
        this.setState({
            loggedIn: true,
            user: {
                name: "Anyul Rivas",
                profilePic: "https://avatars3.githubusercontent.com/u/100741?s=460&v=4"
            }
        });
    };

    logOut = () => {
        this.setState({
            loggedIn: false,
            lastPictureUrl: "",
            user: {},
            likes: []
        });
    };

    onSignInButtonClick = () => {
        this.logIn();
        this.loadData();
        firebaseAuth.signInWithPopup(instagramProvider)
            .then(response => console.info(response))
            .catch(err => console.error(err));
        //window.open("/redirect", "firebaseAuth", "height=315,width=400");
    };

    likeBack = () => {
        this.state.likes.forEach((user, index) => {
            setTimeout(() => {
                this.likeLastPic(user.name, index)
            }, (index * 250));
        });
    };

    likeLastPic = (pic, index) => {
        this.setState({
            percentage: Math.floor(100 * (index + 1) / this.state.likes.length)
        }, () => {
            this.setState({
                loading: this.state.percentage !== 100
            });
        });

        console.info(`liking pic ${pic}. Loading: ${this.state.percentage !== 100}`);
    };

    render() {
        const {state: {loggedIn, lastPictureUrl, likes, loading, percentage, user: {name, profilePic}}} = this;
        return (
            <div className="App">
                <Grid fluid>
                    <Navbar inverse fluid>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="#home">Instagram</a>
                            </Navbar.Brand>
                        </Navbar.Header>
                        <Navbar.Collapse><Navbar.Form pullRight>
                            {loggedIn ? <span>
                                    <Navbar.Text>{name}</Navbar.Text>
                                    <Image src={profilePic} circle height={32}/>
                                    <Button bsStyle="warning" onClick={this.logOut}>Logout</Button>
                                </span> :
                                <Button bsStyle="primary" onClick={this.onSignInButtonClick}>Login</Button>}
                        </Navbar.Form></Navbar.Collapse>
                    </Navbar>
                    <Row>
                        <Col xs={12}>
                            <Jumbotron className="App-header">
                                <h1 className="App-title">My Instagram app</h1>
                            </Jumbotron>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            {loading && <ProgressBar active now={percentage}/>}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6}>
                            <Panel>
                                <Panel.Heading>My latest post</Panel.Heading>
                                <Panel.Body>
                                    {lastPictureUrl &&
                                    <Thumbnail alt="thumb" src={lastPictureUrl}/>}
                                </Panel.Body>
                            </Panel>
                        </Col>
                        <Col xs={6}>
                            <Panel>
                                <Panel.Heading>List of likes: <Badge>{likes.length}</Badge>
                                    <Button style={{float: "right"}}
                                            bsStyle="info"
                                            onClick={this.likeBack}
                                            bsSize="xsmall"> like back</Button>
                                </Panel.Heading>
                                <Panel.Body>
                                    <ListGroup>
                                        {likes.length > 0 ? likes.map((user) => <ListGroupItem
                                                key={user.id}><span>
                                                <Glyphicon glyph="user"/> {user.name}</span>
                                            </ListGroupItem>) :
                                            <ListGroupItem key={0}>The list is empty</ListGroupItem>}
                                    </ListGroup>
                                </Panel.Body>
                            </Panel>
                        </Col>
                    </Row>
                </Grid>
            </div>);
    }
}

export default App;
