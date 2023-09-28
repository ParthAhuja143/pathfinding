import { Box, Button, Modal, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import Node from "../PathFindingVisualizer/Node";

const ModalComp = () => {
    const [open, setOpen] = useState(true);
    const [page, setPage] = useState(1);

    const handleClose = () => {
        setOpen(false);
    };

    const handleNextPage = () => {
        setPage((page) => page + 1);
    };

    const handlePreviousPage = () => {
        setPage((page) => page - 1);
    };

    useEffect(() => {
        if (page > 7) {
            handleClose();
        }
    }, [page]);

    return (
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box
                sx={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: 700,
                    bgcolor: "#121212",
                    color: "white",
                    border: "1px solid #000",
                    boxShadow: 24,
                    p: 4,
                }}
            >
                {page === 1 && (
                    <>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h4"
                        >
                            Welcome to Pathfinding Visualiser!
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            component={"h6"}
                            sx={{ mt: 2 }}
                        >
                            This short tutorial will walk you through all of the
                            features of this application.
                        </Typography>
                        <Typography sx={{mt: 2,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src="/logo512.png" width={"100px"} />
                        </Typography>
                    </>
                )}
                {page === 2 && (
                    <>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h4"
                        >
                            What is a Path Finding Algorithm ?
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            component={"h6"}
                            sx={{ mt: 2 }}
                        >
                            At its core, a pathfinding algorithm seeks to find
                            the shortest path between two points. This
                            application visualizes various pathfinding
                            algorithms in action, and more!
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            All of the algorithms on this application are
                            adapted for a 2D grid, and movements from a to
                            another have a "cost" of 1, barring weighted nodes
                            which have a "cost" of 15. Moreover there are enemy
                            nodes which have a threat level and the start node
                            tries to find a way avoiding these. Please note that
                            enemy nodes are different from weight nodes beacause
                            weight nodes cost "15" if our path crosses a weight
                            node while enemy nodes have a threat radius and if
                            our path get's within that threat radius then it'll
                            cost more energy.
                        </Typography>
                    </>
                )}
                {page === 3 && (
                    <>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h4"
                        >
                            Picking an algorithm
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            component={"h6"}
                            sx={{ mt: 2 }}
                        >
                            Choose an algorithm from the "Algorithms" drop-down
                            menu.
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            Note that some algorithms are unweighted, while
                            others are weighted. Unweighted algorithms do not
                            take enemy or weights into account, whereas weighted
                            ones do. Additionally, not all algorithms guarantee
                            the shortest path.
                        </Typography>
                    </>
                )}
                {page === 4 && (
                    <>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h4"
                        >
                            Meet the algorithms
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            <b>Dijkstra's Algorithm</b> (weighted): the father
                            of pathfinding algorithms; guarantees the shortest
                            path
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            <b>A* Search </b> (weighted): arguably the best
                            pathfinding algorithm; uses heuristics to guarantee
                            the shortest path much faster than Dijkstra's
                            Algorithm
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            <b>Riot Algorithm</b> (weighted): An algorithm
                            created by myself, taking into account enemy
                            threats, uses a combination of A* and Dijkstra.
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            <b>Breath-first Search</b> (unweighted): a great
                            algorithm; guarantees the shortest path
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            <b>Depth-first Search</b> (unweighted): a very bad
                            algorithm for pathfinding; does not guarantee the
                            shortest path
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            <b>Greedy Best-first Search</b> (weighted): a
                            faster, more heuristic-heavy version of A*; does not
                            guarantee the shortest path
                        </Typography>
                    </>
                )}
                {page === 5 && (
                    <>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h4"
                        >
                            Adding walls, weights & enemies
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            component={"h6"}
                            sx={{ mt: 2 }}
                        >
                            Click on the grid to add a wall. Click on the grid
                            while pressing W to add a weight. Cick on the grid
                            while pressing E to add an enemy ( only applicable
                            if "RIOT ALGORITHM" is selected ) Generate mazes and
                            patterns from the "Maze Algorithm" drop-down menu.
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            Walls are impenetrable, meaning that a path cannot
                            cross through them. Weights, however, are not
                            impassable. They are simply more "costly" to move
                            through. In this application, moving through a
                            weight has a "cost" of 15. Enemies on the other hand
                            have no weight, but have a threat level.
                        </Typography>
                        <Typography
                            sx={{
                                mt: 2,
                                width: "fit-content",
                                display: "flex",
                            }}
                        >
                            <table
                                className="grid"
                                style={{ background: "white", margin: "10px" }}
                            >
                                <tbody>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={"wall-node"}
                                        />
                                        <Node />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node
                                            additionalClassName={"wall-node"}
                                        />
                                        <Node />
                                        <Node
                                            additionalClassName={"wall-node"}
                                        />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node
                                            additionalClassName={"wall-node"}
                                        />
                                        <Node />
                                        <Node
                                            additionalClassName={"wall-node"}
                                        />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={"wall-node"}
                                        />
                                        <Node />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={"wall-node"}
                                        />
                                        <Node />
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="grid"
                                style={{ background: "white", margin: "10px" }}
                            >
                                <tbody>
                                    <tr>
                                        <Node
                                            additionalClassName={"weight-node"}
                                        />
                                        <Node />
                                        <Node />
                                        <Node />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={"weight-node"}
                                        />
                                        <Node />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node
                                            additionalClassName={"weight-node"}
                                        />
                                        <Node />
                                        <Node />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={"weight-node"}
                                        />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={"weight-node"}
                                        />
                                    </tr>
                                </tbody>
                            </table>
                            <table
                                className="grid"
                                style={{ background: "white", margin: "10px" }}
                            >
                                <tbody>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                        <Node />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                        <Node
                                            additionalClassName={
                                                "threat-node-10"
                                            }
                                        />
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                        <Node
                                            additionalClassName={
                                                "threat-node-10"
                                            }
                                        />
                                        <Node
                                            additionalClassName={"enemy-node"}
                                        />
                                        <Node
                                            additionalClassName={
                                                "threat-node-10"
                                            }
                                        />
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                        <Node
                                            additionalClassName={
                                                "threat-node-10"
                                            }
                                        />
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                        <Node />
                                    </tr>
                                    <tr>
                                        <Node />
                                        <Node />
                                        <Node
                                            additionalClassName={
                                                "threat-node-5"
                                            }
                                        />
                                        <Node />
                                        <Node />
                                    </tr>
                                </tbody>
                            </table>
                        </Typography>
                    </>
                )}
                {page === 6 && (
                    <>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h4"
                        >
                            Color Coding
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            component={"h6"}
                            sx={{ mt: 2 }}
                        >
                            Nodes are colored based on there status and types.
                            Here are the color codes for all thes.
                        </Typography>
                        <Typography variant="p" component={"p"} sx={{ mt: 2 }}>
                            <Paper
                                sx={{
                                    padding: 1,
                                    display: "flex",
                                    background: "#121212",
                                    justifyContent: "flex-start",
                                    alignItems: "flex-start",
                                    flexDirection: "column",
                                    borderRadius: 0,
                                }}
                            >
                                <div className="flex">
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="start-node circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Start
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="finish-node circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Finish
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="wall-node circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Wall
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="weight-node circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Weight
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="enemy-node circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Enemy
                                        </Typography>
                                    </span>
                                </div>
                                <div className="flex">
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node
                                            additionalClassName={
                                                "visited-node circle"
                                            }
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Visited
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node
                                            additionalClassName={
                                                "unvisited-node circle"
                                            }
                                        />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Unvisited
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="node-shortest-path circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Path
                                        </Typography>
                                    </span>
                                </div>
                                <div className="flex">
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="threat-node-10 circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Maximum Threat
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="threat-node-5 circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Moderate Threat
                                        </Typography>
                                    </span>
                                    <span
                                        className="flex"
                                        style={{
                                            border: "1px solid #121212",
                                            borderRadius: "20px",
                                            padding: "2px",
                                            background: "white",
                                        }}
                                    >
                                        <Node additionalClassName="threat-node-2 circle" />
                                        <Typography
                                            variant="subtitle2"
                                            color={"black"}
                                            margin={"0 10px"}
                                        >
                                            Low Threat
                                        </Typography>
                                    </span>
                                </div>
                            </Paper>
                        </Typography>
                    </>
                )}
                {page === 7 && (
                    <>
                        <Typography
                            id="modal-modal-title"
                            variant="h4"
                            component="h4"
                        >
                            Enjoy !
                        </Typography>
                        <Typography
                            id="modal-modal-description"
                            variant="h6"
                            component={"h6"}
                            sx={{ mt: 2 }}
                        >
                            I hope you'll have as much fun with this application
                            as I had building it.
                        </Typography>
                        <Typography sx={{mt: 2,display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <img src="/logo512.png" width={"100px"} />
                        </Typography>
                    </>
                )}
                <span style={{display: 'flex', justifyContent: 'space-between'}}>
                <Typography sx={{mt: 2}}>
                <Button sx={{ m: 1 }} onClick={handleClose}>
                            Skip
                        </Button>
                </Typography>
                <Typography sx={{ mt: 2 }}>
                    {page > 1 && (
                        <Button sx={{ m: 1 }} onClick={handlePreviousPage}>
                            Previous
                        </Button>
                    )}
                    {page < 8 && (
                        <Button sx={{ m: 1 }} onClick={handleNextPage}>
                            Next
                        </Button>
                    )}
                </Typography>
                </span>
            </Box>
        </Modal>
    );
};

export default ModalComp;
