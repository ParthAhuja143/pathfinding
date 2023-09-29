import React, { useEffect, useState } from "react";
import Node from "./Node";
import "./style.css";
import { GridBoard } from "../../dataStructures/Grid";
import {
    AppBar,
    Button,
    Chip,
    Container,
    FormControl,
    FormGroup,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Paper,
    Select,
    Toolbar,
    Typography,
} from "@mui/material";
import RouteSharpIcon from "@mui/icons-material/RouteSharp";
import ModalComp from "../Modal";
import DeleteIcon from '@mui/icons-material/Delete';

const AlgorithmMap = [
    {
        value: "Dijkstra",
        label: "Dijkstra Algorithm",
        tags: ["Best Path", "Weighted"],
    },
    {
        value: "Breadth First Search",
        label: "Breadth First Search",
        tags: ["Best Path", "Unweighted"],
    },
    {
        value: "Depth First Search",
        label: "Depth First Search",
        tags: ["Unweighted"],
    },
    {
        value: "Bi-Directional BFS",
        label: "Bi-directional BFS",
        tags: ["Best Path", "Unweighted"],
    },
    { value: "Greedy BFS", label: "Greedy BFS", tags: ["Unweighted"] },
    {
        value: "AStar",
        label: "A-Star Algorithm",
        tags: ["Best Path", "Weighted", "Heuristic-Heavy"],
    },
    {
        value: "Riot",
        label: "Riot Algorithm",
        tags: ["Best Path", "A Star", "Dijkstra"],
    },
];

const TagMap = {
    "Best Path": {
        color: "#42b883"
    },
    "A Star": {
        color: "#6643b5"
    },
    "Dijkstra": {
        color: '#eb2632'
    },
    "Unweighted": {
        color: '#ff8b00'
    },
    "Weighted": {
        color: '#303841'
    },
    "Heuristic-Heavy": {
        color: '#ff004d'
    },
    "Horizontal Bias": {
        color: '#0881a3'
    },
    "Vertical Bias": {
        color: '#442a23'
    },
    "Walls": {
        color: '#00204a'
    },
}

const MazeAlgorithm = [
    {
        value: "Walls Recursive Division - Horizontal Skew",
        label: "Walls Recursive Division - Horizontal Skew",
        tags: ["Walls", "Horizontal Bias"],
    },
    {
        value: "Weighted Recursive Division - Horizontal Skew",
        label: "Weighted Recursive Division - Horizontal Skew",
        tags: ["Weighted", "Horizontal Bias"],
    },
    {
        value: "Walls Recursive Division - Vertical Skew",
        label: "Walls Recursive Division - Vertical Skew",
        tags: ["Walls", "Vertical Bias"],
    },
    {
        value: "Weighted Recursive Division - Vertical Skew",
        label: "Weighted Recursive Division - Vertical Skew",
        tags: ["Weighted", "Vertical Bias"],
    },
];

const EnemyAlgorithm = [
    { value: "Ambush", label: "Ambush" },
    { value: "Sniper Alley", label: "Sniper Alley" },
    { value: "Divide and Conquer", label: "Divide and Conquer" },
    { value: "Blocking Path", label: "Blocking Path" },
    { value: "Defensive Line", label: "Defensive Line" },
    { value: "Spread Out", label: "Spread Out" },
];

const heuristicMap = [
    { value: "Manhattan" },
    { value: "Euclidian" },
    { value: "Diagonal" },
];

const functionalityMap = {
    "Dijkstra": {
        canSelectHeuristic: false,
        canCreateEnemies: false,
        canCreateWalls: true,
        canCreateWeightedNodes: true,
        tags: ["Best Path", "Weighted"],
        description: "Dijkstra's Algorithm is weighted and guarantees the shortest path!",
    },
    "Breadth First Search": {
        canSelectHeuristic: false,
        canCreateEnemies: false,
        canCreateWalls: true,
        tags: ["Best Path", "Unweighted"],
        canCreateWeightedNodes: true,
        description: "Breath First Search is unweighted and guarantees the shortest path!",
    },
    "Depth First Search": {
        canSelectHeuristic: false,
        canCreateEnemies: false,
        canCreateWalls: true,
        tags: ["Unweighted"],
        canCreateWeightedNodes: true,
        description: "Depth First Search is unweighted and does not guarantee the shortest path!",
    },
    "Bi-Directional BFS": {
        canSelectHeuristic: false,
        canCreateEnemies: false,
        canCreateWalls: true,
        canCreateWeightedNodes: true,
        tags: ["Best Path", "Unweighted"],
        description: "Bi-Directional Breath First Search is unweighted and guarantees the shortest path!",
    },
    "Greedy BFS": {
        canSelectHeuristic: false,
        canCreateEnemies: false,
        canCreateWalls: true,
        canCreateWeightedNodes: true,
        tags: ["Unweighted"],
        description: "Greedy Best First Search is weighted and does not guarantee the shortest path!",
    },
    "AStar": {
        canSelectHeuristic: true,
        canCreateEnemies: false,
        canCreateWalls: true,
        canCreateWeightedNodes: true,
        tags: ["Best Path", "Weighted", "Heuristic-Heavy"],
        description: "A Star Search is weighted and guarantees the shortest path! It works by taking into account distance from start node to current node and also predicted distance from current node to target node (also known as heuristc calculation).",
    },
    "Riot": {
        canSelectHeuristic: true,
        canCreateEnemies: true,
        canCreateWalls: true,
        canCreateWeightedNodes: true,
        tags: ["Best Path", "A Star", "Dijkstra"],
        description: "Riot Algorithm was developed by myself (atleast from my knowledge, as I didn't find anything like this online), this algorithm is a combination of A Star and Dijkstra, the algorithm also takes into account threat levels of node and enemy nodes. Enemies can cause threats within a 2 unit radius, Multiple enemies can super impose threat levels, the start node tries to find the best path from start to finish while trying to avoid nodes that can cause threats. As you can imagine, the algorithm got it's name from gaming strategies where the character has to avoid danger zones and reach the target.",
    },
};

const PathFindingVisualizer = () => {
    const [grid, setGrid] = useState(null);
    const [isWeightKeyDown, setIsWeightKeyDown] = useState(false);
    const [isEnemyKeyDown, setIsEnemyKeyDown] = useState(false);
    const [selectedAlgorithm, setSelectedAlgorithm] = useState(
        "Riot"
    );
    const [selectedEnemyAlgorithm, setSelectedEnemyAlgorithm] =
        useState("Ambush");
    const [selectedHeuristics, setSelectedHeuristics] = useState("Manhattan");
    const [selectedMaze, setSelectedMaze] = useState(
        "Walls Recursive Division - Horizontal Skew"
    );
    const [canClickButton, setCanClickButton] = useState(true);

    useEffect(() => {
        const newGrid = new GridBoard(
            15,
            50,
            setCanClickButton
        ).initialiseGrid();
        setGrid(newGrid);

        window.addEventListener("keydown", (event) => {
            if (event.key === "w" || event.key === "W") {
                setIsWeightKeyDown(true);
            } else if (event.key === "e" || event.key === "E") {
                setIsEnemyKeyDown(true);
            }
        });

        window.addEventListener("keyup", (event) => {
            if (event.key === "w" || event.key === "W") {
                setIsWeightKeyDown(false);
            } else if (event.key === "e" || event.key === "E") {
                setIsEnemyKeyDown(false);
            }
        });

        return () => {
            window.removeEventListener("keydown", (event) => {
                if (event.key === "w" || event.key === "W") {
                    setIsWeightKeyDown(true);
                } else if (event.key === "e" || event.key === "E") {
                    setIsEnemyKeyDown(true);
                }
            });
            window.removeEventListener("keyup", (event) => {
                if (event.key === "w" || event.key === "W") {
                    setIsWeightKeyDown(false);
                } else if (event.key === "e" || event.key === "E") {
                    setIsEnemyKeyDown(false);
                }
            });
        };
    }, []);

    const visualiseMaze = (algorithm) => {
        grid.removeWallsAndWeights();
        grid.removeVisited();
        switch (algorithm) {
            case "Walls Recursive Division - Horizontal Skew":
                grid.recursiveDivisionMazeGeneration("horizontal", "wall");
                break;
            case "Walls Recursive Division - Vertical Skew":
                grid.recursiveDivisionMazeGeneration("vertical", "wall");
                break;
            case "Weighted Recursive Division - Horizontal Skew":
                grid.recursiveDivisionMazeGeneration("horizontal", "weights");
                break;
            case "Weighted Recursive Division - Vertical Skew":
                grid.recursiveDivisionMazeGeneration("vertical", "weights");
                break;
            default:
                break;
        }
    };

    const visualiseEnemyAlgorithm = (algorithm) => {
        grid.removeVisited();
        grid.removeEnemies();
        grid.createEnemyLines(algorithm);
    };

    const visualiseAlgorithm = () => {
        switch (selectedAlgorithm) {
            case "Dijkstra":
                grid.removeEnemies();
                grid.dijkstra();
                break;

            case "Breadth First Search":
                grid.removeEnemies();
                grid.bfs();
                break;

            case "Depth First Search":
                grid.removeEnemies();
                grid.dfs();
                break;

            case "Bi-Directional BFS":
                grid.removeEnemies();
                grid.biDirectionalBFS();
                break;
            case "Greedy BFS":
                grid.removeEnemies();
                grid.greedyBFS();
                break;

            case "AStar":
                grid.removeEnemies();
                grid.aStar(selectedHeuristics);
                break;

            case "Riot":
                grid.riotAlgorithm(selectedHeuristics);
                break;

            default:
                break;
        }
    };

    const runAlgorithm = () => {
        grid.removeVisited();
        visualiseAlgorithm();
    };

    const addWallToGrid = (row, col) => {
        if (grid && grid.board) {
            const newGrid = grid.addWall(row, col);
            setGrid(newGrid);
        }
    };

    const addWeightsToGrid = (row, col) => {
        if (grid && grid.board) {
            const newGrid = grid.addWeight(row, col);
            setGrid(newGrid);
        }
    };

    const addEnemyToGrid = (row, col) => {
        if (grid && grid.board) {
            const newGrid = grid.addEnemy(row, col);
            setGrid(newGrid);
        }
    };

    const handleAlgorithmChange = (event) => {
        setSelectedAlgorithm(event.target.value);
    };

    const handleMazeAlgorithmChange = (event) => {
        visualiseMaze(event.target.value);
        setSelectedMaze(event.target.value);
    };

    const handleEnemyAlgorithmChange = (event) => {
        visualiseEnemyAlgorithm(event.target.value);
        setSelectedEnemyAlgorithm(event.target.value);
    };

    const handleHeuristicsChange = (event) => {
        setSelectedHeuristics(event.target.value);
    };

    const handleClickEvent = (event, row, col) => {
        event.preventDefault();
        if (
            (row === grid.startNode.row && col === grid.startNode.col) ||
            (row === grid.endNode.row && col === grid.endNode.col)
        )
            return;
        if (isWeightKeyDown) {
            addWeightsToGrid(row, col);
        } else if (selectedAlgorithm === "Riot" && isEnemyKeyDown) {
            addEnemyToGrid(row, col);
        } else {
            addWallToGrid(row, col);
        }
    };

    const clearGrid = () => {
        const grid = new GridBoard(15, 50, setCanClickButton).initialiseGrid();
        setGrid(grid);
    };

    return (
        <>
        <ModalComp />
            <Paper
                sx={{
                    padding: 1,
                    display: "flex",
                    background: "#121212",
                    justifyContent: "flex-start",
                    alignItems: "flex-start",
                    flexDirection: "column",
                    borderRadius: 0
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
                            Start Node
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
                            Finish Node
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
                            Wall Node
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
                            Weight Node
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
                            Enemy Node
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
                        <Node additionalClassName={"visited-node circle"} />
                        <Typography
                            variant="subtitle2"
                            color={"black"}
                            margin={"0 10px"}
                        >
                            Visited Node
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
                        <Node additionalClassName={"unvisited-node circle"} />
                        <Typography
                            variant="subtitle2"
                            color={"black"}
                            margin={"0 10px"}
                        >
                            Unvisited Node
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
                            Path Node
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
                            Maximum Threat Node
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
                            Moderate Threat Node
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
                            Low Threat Node
                        </Typography>
                    </span>
                </div>
            </Paper>
            <AppBar
                position="static"
                sx={{
                    background: "#121212",
                    p: 2,
                    boxShadow:
                        "0px 2px 4px -1px rgb(0 0 0 / 20%), 0px 4px 5px 0px rgb(0 0 0 / 14%), 0px 1px 10px 0px rgb(0 0 0 / 12%)",
                    color: "white",
                }}
            >
                <Container maxWidth="xl" sx={{display: 'flex', flexDirection: 'column'}}>
                    <Toolbar disableGutters>
                        <FormGroup
                            sx={{
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "center",
                                alignItems: "center",
                                color: "white",
                                width: "100%",
                            }}
                        >
                            <FormControl sx={{ m: 1 }}>
                                <InputLabel id="demo-multiple-checkbox-label">
                                    Algorithm
                                </InputLabel>
                                <Select
                                    disabled={!canClickButton}
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    value={selectedAlgorithm}
                                    onChange={handleAlgorithmChange}
                                    input={<OutlinedInput label="Algorithm" />}
                                    renderValue={(value) =>
                                        value + ` Algorithm`
                                    }
                                    sx={{
                                        color: "white",
                                        background: "#222222",
                                    }}
                                >
                                    {AlgorithmMap.map((algorithm, index) => (
                                        <MenuItem
                                            key={index}
                                            value={algorithm.value}
                                        >
                                            <Typography variant="p">
                                                {algorithm.label}
                                                {algorithm.tags.map(
                                                    (tag, index) => {
                                                        return (
                                                            <Chip
                                                                size="small"
                                                                key={index}
                                                                label={tag}
                                                                sx={{ m: 1, color: 'white', background: TagMap[tag].color}}
                                                            />
                                                        );
                                                    }
                                                )}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {functionalityMap[selectedAlgorithm]
                                .canSelectHeuristic && (
                                <FormControl sx={{ m: 1 }}>
                                    <InputLabel id="demo-multiple-checkbox-label">
                                        Heuristics
                                    </InputLabel>
                                    <Select
                                        disabled={!canClickButton}
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        value={selectedHeuristics}
                                        onChange={handleHeuristicsChange}
                                        input={
                                            <OutlinedInput label="Heuristics" />
                                        }
                                        renderValue={(value) =>
                                            value + ` Heuristic`
                                        }
                                        sx={{
                                            color: "white",
                                            background: "#222222",
                                        }}
                                    >
                                        {heuristicMap.map((h, index) => (
                                            <MenuItem
                                                key={index}
                                                value={h.value}
                                            >
                                                <Typography variant="p">
                                                    {h.value}
                                                </Typography>
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            )}
                            <FormControl>
                                <Button
                                    variant="contained"
                                    size="small"
                                    disabled={!canClickButton}
                                    startIcon={<RouteSharpIcon />}
                                    onClick={runAlgorithm}
                                    sx={{
                                        m: 1,
                                    }}
                                >
                                    Visualise {selectedAlgorithm}
                                </Button>
                                <Button
                                    variant="contained"
                                    size="small"
                                    startIcon={<DeleteIcon />}
                                    onClick={clearGrid}
                                    sx={{
                                        m: 1,
                                    }}
                                >
                                    Clear Grid
                                </Button>
                            </FormControl>
                            {selectedAlgorithm === "Riot" && (
                                <FormControl
                                    sx={{ m: 1 }}
                                    disabled={!canClickButton}
                                >
                                    <InputLabel id="demo-multiple-checkbox-label">
                                        Enemy Generation
                                    </InputLabel>
                                    <Select
                                        disabled={!canClickButton}
                                        labelId="demo-multiple-checkbox-label"
                                        id="demo-multiple-checkbox"
                                        value={selectedEnemyAlgorithm}
                                        onChange={handleEnemyAlgorithmChange}
                                        input={
                                            <OutlinedInput label="Enemy Algorithm" />
                                        }
                                        renderValue={(value) =>
                                            value + ` Algorithm`
                                        }
                                        sx={{
                                            color: "white",
                                            background: "#222222",
                                        }}
                                    >
                                        {EnemyAlgorithm.map(
                                            (enemyAlgo, index) => (
                                                <MenuItem
                                                    key={index}
                                                    onClick={(event) => {
                                                        if (!canClickButton)
                                                            return;
                                                        handleEnemyAlgorithmChange(
                                                            {
                                                                target: {
                                                                    value: event
                                                                        .target
                                                                        .outerText,
                                                                },
                                                            }
                                                        );
                                                    }}
                                                    value={enemyAlgo.value}
                                                >
                                                    <Typography variant="p">
                                                        {enemyAlgo.label}
                                                    </Typography>
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            )}
                            <FormControl
                                sx={{ m: 1 }}
                                disabled={!canClickButton}
                            >
                                <InputLabel id="demo-multiple-checkbox-label">
                                    Maze Generation
                                </InputLabel>
                                <Select
                                    disabled={!canClickButton}
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    value={selectedMaze}
                                    onChange={handleMazeAlgorithmChange}
                                    input={
                                        <OutlinedInput label="Maze Generation" />
                                    }
                                    renderValue={(value) => value}
                                    sx={{
                                        color: "white",
                                        background: "#222222",
                                    }}
                                >
                                    {MazeAlgorithm.map((mazeAlgo, index) => (
                                        <MenuItem
                                            key={index}
                                            value={mazeAlgo.value}
                                            onClick={(event) => {
                                                if (!canClickButton) return;
                                                handleMazeAlgorithmChange({
                                                    target: {
                                                        value: event.target.firstChild.data
                                                    },
                                                });
                                            }}
                                        >
                                            <Typography variant="p">
                                                {mazeAlgo.label}
                                                {mazeAlgo.tags.map((tag, index) => {
                                                    return <Chip key={index} label={tag} sx={{m: 1, color: 'white', background: TagMap[tag].color}} />
                                                })}
                                            </Typography>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </FormGroup>
                    </Toolbar>
                </Container>
            </AppBar>
            <Container sx={{m: 2, width: '100%'}}>
            <Typography variant="h3" textAlign={'left'} sx={{display: 'flex'}}>
                {selectedAlgorithm + ' Algorithm'}
            </Typography>
            <span style={{display: 'flex'}}>
            {functionalityMap[selectedAlgorithm].tags.map((tag, index) => {
                    return <Chip key={index} label={tag} sx={{m: 1, background: TagMap[tag].color, color: 'white'}} />
             })}
            </span>
            <Typography variant="p" textAlign={'left'} lineHeight={1.6} sx={{display: 'flex'}}>
                    {functionalityMap[selectedAlgorithm].description}
            </Typography>
            </Container>
            <Paper sx={{ m: 1, p: 1 }}>
                <table className="grid">
                    <tbody>
                        {grid &&
                            grid.board &&
                            grid.board.map((row, rowId) => {
                                return (
                                    <tr key={rowId}>
                                        {row.map((node, nodeId) => {
                                            return (
                                                <Node
                                                    node={node}
                                                    key={node.id}
                                                    handleClick={(event) => {
                                                        handleClickEvent(
                                                            event,
                                                            node.row,
                                                            node.col
                                                        );
                                                    }}
                                                    grid={grid}
                                                />
                                            );
                                        })}
                                    </tr>
                                );
                            })}
                    </tbody>
                </table>
            </Paper>
        </>
    );
};

export default PathFindingVisualizer;
