import React, { Component } from 'react';
import { LineChart, Line, YAxis, XAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

class LineRechart extends Component {
    stats = {};
    countStories(item){
        const dt = new Date(item['_ValidFrom']);
        const month = dt.toLocaleString('default', { month: 'long' });
        this.stats[month] = (this.stats[month] || 0) + 1;
    }

    bucketData(){
        const data = []
        for (let k in this.stats){
            data.push({"month": k, "In-Progress": this.stats[k]})
        }
        //console.log(data)
        return data;
    }

    render() {
        return (
            <div>
                {this.props.items.map(item => this.countStories(item))}
                <LineChart width={1000} height={250} data={this.bucketData()}
                    margin={{ top: 5, right: 40, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="month" interval={0}/>
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="In-Progress" stroke="#0095FF" />
                </LineChart>
            </div>
        )
    };
}

export default LineRechart;