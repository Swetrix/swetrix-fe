import React from "react";
import bb from "billboard.js";
import "billboard.js/dist/theme/datalab.css"
import "billboard.js/dist/billboard.css";

class Chart extends React.Component {
  chartInstance = {};
  timer = null;

  componentDidMount() {
    this.renderChart();
  }

  UNSAFE_componentWillReceiveProps() {
    if (this.props.isResize && this.chartInstance !== null) {
      const time = 100;

      if (this.timer) {
        clearTimeout(this.timer);
      }

      this.timer = setTimeout(() => {
        this.renderChart();
      }, time);
    }
  }

  componentWillUnmount() {
    this.destroy();
  }

  destroy() {
    if (this.chartInstance !== null) {
      try {
        this.chartInstance.destroy();
      } catch (error) {
        console.error("Internal billboard.js error", error);
      } finally {
        this.chartInstance = null;
      }
    }
  }

  renderChart = () => {
    if (this.props.current !== null) {
      this.chartInstance = bb.generate({
        ...this.props.options,
        bindto: "#"+this.props.current
      });
    }
  };

  getInstance = () => {
    return this.chartInstance;
  };

  render() {
    return (
      <div>
        <div id={this.props.current} />
        {this.props.children}
      </div>
    );
  }
}

export default Chart
