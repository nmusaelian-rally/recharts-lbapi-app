import React, { Component } from 'react';
import { LineChart, Line, YAxis, XAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

class LineRechart extends Component {
    stats = {};
    countStories(item){
        const dt = new Date(item['_ValidFrom']);
        const scheduleState = item['ScheduleState'];
        const month = dt.toLocaleString('default', {month: 'long'});
        this.stats[month] = this.stats[month] || {} ;
        this.stats[month][scheduleState] = (this.stats[month][scheduleState] || 0) + 1;
    }

    bucketData(){
        const data = []
        for (let k in this.stats){
            data.push({"month": k, "In-Progress": this.stats[k]["In-Progress"], "Released": this.stats[k]["Released"]})
        }
        return data;
    }

    render() {
        return (
            <div>
                {this.props.items && this.props.items[0] && this.props.items[0].map(item => this.countStories(item))}
                {this.props.items && this.props.items[1] && this.props.items[1].map(item => this.countStories(item))}
                <LineChart width={1000} height={250} data={this.bucketData()}
                    margin={{ top: 5, right: 40, left: 40, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="4 4" />
                    <XAxis dataKey="month" interval={0}/>
                    <YAxis />
                    <Tooltip />
                    <Legend wrapperStyle={{position: 'relative', marginTop: '20px'}}/>
                    <Line name="moved to In-Progress" type="monotone" dataKey="In-Progress" stroke="#0095FF" />
                    <Line name="moved to Released" type="monotone" dataKey="Released" stroke="#FF0000" />
                </LineChart>
            </div>
        )
    };
}

export default LineRechart;