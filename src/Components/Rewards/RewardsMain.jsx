import React, { useState, useEffect } from "react";
import CustomToast from "./CustomToast";
import RewardsList from "./RewardsList";
import { Col, Container, Row } from 'react-bootstrap';
import { getSalesData } from "../../API/api";
import SampleData from "../../Reference/SampleData";
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from "@mui/material";

const over100PointRate = 2;
const between50to100PointRate = 1;

const CalculateRewardPoints = (amount) => {
    let rewardPoint = 0;
    if (amount > 100) {
        const above100Points = amount - 100;
        // multiply points with 2 for over $100 spent in a transaction
        rewardPoint += above100Points * over100PointRate;
        // multiply 50 points with 1 for between $50 and $100 spent in a transaction
        rewardPoint += 50 * between50to100PointRate;
    } else if (amount > 50 && amount <= 100) {
        const between50to100Points = amount - 50;
        // multiply 50 points with 1 for between $50 and $100 spent in a transaction
        rewardPoint += between50to100Points * between50to100PointRate;
    }
    return rewardPoint;
}

const monthDiff = (dateFrom, dateTo) => {
    return dateTo.getMonth() - dateFrom.getMonth() +
        (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
}

const defaultToast = {
    show: false,
    message: "",
    variant: "success"
}

export default function RewardsMain(props) {
    const [toast, setToast] = useState(defaultToast);
    const [isLoading, setIsLoading] = useState(false);
    const [formattedData, setFormattedData] = useState([]);
    const [loadData, setLoadData] = useState("local");

    const setToastMessage = (variant = "success", message = "") => {
        setToast({
            show: true,
            variant,
            message
        });
    }

    const handleCloseToast = () => {
        setToast({
            ...toast,
            show: false
        });
    }

    const FormatTransactionData = (transactionData) => {
        const userWiseData = [];

        for (let i = 0; i < transactionData.length; i++) {
            const transaction = transactionData[i];

            const { userid, name, transactionDate, transactionAmount } = transaction;

            const userIndex = userWiseData.findIndex(data => data.userid === userid);

            let last3rdMonthAmount = userIndex !== -1 ? userWiseData[userIndex].last3rdMonthAmount : 0;
            let last2ndMonthAmount = userIndex !== -1 ? userWiseData[userIndex].last2ndMonthAmount : 0;
            let lastMonthAmount = userIndex !== -1 ? userWiseData[userIndex].lastMonthAmount : 0;

            let last3rdMonthRewards = userIndex !== -1 ? userWiseData[userIndex].last3rdMonthRewards : 0;
            let last2ndMonthRewards = userIndex !== -1 ? userWiseData[userIndex].last2ndMonthRewards : 0;
            let lastMonthRewards = userIndex !== -1 ? userWiseData[userIndex].lastMonthRewards : 0;

            let currentMonth = new Date().getMonth();
            const transactionMonth = new Date(transactionDate.toString()).getMonth();

            // Condition added when this code is tested in Jan, Feb, March
            if (currentMonth < 3) {
                currentMonth += 12;
            }

            // The dataset, which I found online (https://github.com/sprabhakaran/csvfiles/blob/master/SalesData.csv)
            // is having older data, eg. for year 2002, 2003, 2004
            // Comment below condition (isValidYear) to calculate for given api dataset

            const isValidYear = monthDiff(new Date(transactionDate.toString()), new Date()) < 4;
            if (isValidYear) {
                const amount = parseInt(transactionAmount.toString());
                if (transactionMonth === currentMonth - 3) {
                    // Check if the transaction date is for the 3rd last month
                    last3rdMonthAmount += amount;
                    last3rdMonthRewards += CalculateRewardPoints(amount);
                    console.log("Last 3rd month amount", amount, "\nReward point: ", CalculateRewardPoints(amount));
                } else if (transactionMonth === currentMonth - 2) {
                    // Check if the transaction date is for the 2nd last month
                    last2ndMonthAmount += amount;
                    last2ndMonthRewards += CalculateRewardPoints(amount);
                    console.log("Last 2nd month amount", amount, "\nReward point: ", CalculateRewardPoints(amount));
                } else if (transactionMonth === currentMonth - 1) {
                    // Check if the transaction date is for the last month
                    lastMonthAmount += amount;
                    lastMonthRewards += CalculateRewardPoints(amount);
                    console.log("Last month amount", amount, "\nReward point: ", CalculateRewardPoints(amount));
                }
            }

            const userData = {
                userid,
                name,
                last3rdMonthAmount,
                last2ndMonthAmount,
                lastMonthAmount,
                last3rdMonthRewards,
                last2ndMonthRewards,
                lastMonthRewards,
                totalAmount: last3rdMonthAmount + last2ndMonthAmount + lastMonthAmount,
                totalRewards: last3rdMonthRewards + last2ndMonthRewards + lastMonthRewards
            }

            if (userIndex === -1) {
                // Add new user if it is not in the list
                userWiseData.push(userData);
            } else {
                // assign user data with updated values
                userWiseData[userIndex] = userData;
            }
        }

        const sortData = userWiseData.sort((a, b) => a.userid - b.userid);
        setFormattedData(sortData);

        setToastMessage("success", "Data loaded successfully!");
    }

    const loadSalesData = async (loadDataFrom) => {
        if (loadDataFrom === "api") {
            setIsLoading(true);
            try {
                await getSalesData().then((res) => {
                    console.log("Sales Data", res);
                    FormatTransactionData(res);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Error loading data", error);
                setToastMessage("error", "Data could not be loaded!");
                setIsLoading(false);
            }
        } else {
            FormatTransactionData(SampleData);
            setIsLoading(false);
        }
    }

    const handleRefreshButton = (newValue) => {
        setIsLoading(true);
        setTimeout(() => {
            loadSalesData(newValue);
        }, 1000);
    }

    const handleChangeDataSelection = (event) => {
        setLoadData(event.target.value);
        handleRefreshButton(event.target.value);
    }

    useEffect(() => {
        loadSalesData(loadData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div>
            <Container fluid="md">
                <Row className="justify-content-md-center" style={{ marginTop: "20px", marginBottom: "20px" }}>
                    <Col sm={2}></Col>
                    <Col sm={2}>
                        <FormControl style={{ color: "white" }}>
                            <FormLabel id="demo-controlled-radio-buttons-group" style={{ color: "white" }}>Load data from:</FormLabel>
                            <RadioGroup
                                row
                                aria-labelledby="demo-controlled-radio-buttons-group"
                                name="controlled-radio-buttons-group"
                                value={loadData}
                                onChange={handleChangeDataSelection}
                            >
                                <FormControlLabel value={"local"} control={<Radio />} label="Local" />
                                <FormControlLabel value={"api"} control={<Radio />} label="API" />
                            </RadioGroup>
                        </FormControl>
                    </Col>
                    <Col sm={2}></Col>
                </Row>
                <Row className="justify-content-md-center">
                    <Col sm={2}></Col>
                    <Col>
                        <RewardsList rows={formattedData} isLoading={isLoading} />
                    </Col>
                    <Col sm={2}></Col>
                </Row>
            </Container>
            <CustomToast toast={toast} handleCloseToast={handleCloseToast} />
        </div>
    )
}
