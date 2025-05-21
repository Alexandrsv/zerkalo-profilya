import eruda from "eruda";
import erudaCode from "eruda-code";
import erudaDom from "eruda-dom";
import erudaFps from "eruda-fps";

eruda.init();
eruda.add(erudaCode);
eruda.add(erudaDom);
eruda.add(erudaFps);

export default eruda;
