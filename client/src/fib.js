import React from 'react';
import axios from 'axios';

class Fib extends React.Component {
    state = {
        seenIndexes: [],
        values: {},
        index: ''
    };


    componentDidMount() {
        this.fetchValues();
        this.fetchIndexes();
    }

    fetchValues() {
        axios.get('/api/values/current').then(res => {
            this.setState({
                values: res.data
            });
        });
    }

    fetchIndexes() {
        axios.get('/api/values/all').then(res => {
            this.setState({
                seenIndexes: res.data
            });
        });
    }

    renderSeenIndexes() {
        return this.state.seenIndexes.map(({ number }) => number).join(', ');
    }

    renderValues() {
        const entries = [];
        for (let key in this.state.values) {
            entries.push(
                <div key={key}>
                    For index {key} I calculated {this.state.values[key]};
                </div>
            );
        }
        return entries;
    }

    handleSubmit = (event) => {
        event.preventDefault();
        axios.post('/api/values', {
            index: this.state.index
        }).then(res => {

        });

        this.setState({index : ''});
    };
    render() {
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <label>Enter your indes:</label>
                    <input
                        value={this.state.index}
                        onChange={event => this.setState({ index: event.target.value })}
                    />
                    <button type="submit" className="btn btn-primary">Submit</button>
                </form>

                <h3>Indexes i have seen</h3>
                {
                    this.renderSeenIndexes()
                }
                <h3>Calulated values</h3>
                {
                    this.renderValues()
                }
                <div><br /> <br /> <br /> <br /></div>
            </div>
        );
    }
}

export default Fib;