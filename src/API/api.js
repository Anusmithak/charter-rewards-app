import axios from 'axios';

const URL = 'https://raw.githubusercontent.com/sprabhakaran/csvfiles/master/SalesData.csv';

const uniqueDataIndex = 0;
const repeatedDataIndex = 1;

export async function getSalesData() {
    return new Promise(async (resolve, reject) => {
        try {
            await axios.get(URL).then(response => {
                if (response.status) {
                    const fullData = response.data.toString();
                    if (fullData) {
                        const dataArray = fullData.split("\n");
                        const formattedArray = [];
                        for (let i = 1; i < dataArray.length; i++) {
                            if (dataArray[i]) {
                                const splittedData = dataArray[i].split(",");
                                const salesDataObj = {
                                    // Kindly update userid to splittedData[repeatedDataIndex]
                                    // to use repeated region data
                                    // to combine multiple rows based on userid
                                    // Currently I'm using unique data entries
                                    userid: splittedData[uniqueDataIndex],
                                    name: splittedData[1],
                                    transactionDate: splittedData[6],
                                    transactionAmount: splittedData[5]
                                }
                                formattedArray.push(salesDataObj);
                            }
                        }
                        resolve(formattedArray);
                    } else {
                        resolve([]);
                    }
                }
            });
        } catch (e) {
            console.error("Error getting list", e);
            reject([]);
        }
    });
}