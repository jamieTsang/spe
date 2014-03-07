<%@ WebHandler Language="C#" Class="creat" %>
//SPE生成静态网页服务器程序 version_1.0.3 20131005
using System;
using System.Text.RegularExpressions;
using System.Collections;
using System.Collections.Generic;
using System.Web;
using System.Linq;
using System.Xml.Linq;
using System.Text;
using System.Web.SessionState;
using System.Xml;
using System.IO;

public class creat : IHttpHandler {
    public class PageElement
    {
        public string fileName;
        public string title;
        public string keywords;
        public string description;
        public string tkd;
        public int imgNum;
        public List<int> imgHeight;
        //public int lastImgHeight;
        public string bgHeight;
        public string defaultCss;
        public string childrenStyle;
        public string mainImgRepeater;
        public string footScript;
        public bool isSucess = true;
        public ArgumentException exception;
        public PageElement(XDocument data, string path,string fullPath)
        {
            this.fileName = path;
            try
            {
                var root = data.Element("root");
                this.title = root.Element("title").Value;
                this.keywords = root.Element("keywords").Value;
                this.description = root.Element("description").Value;
                Array imgInfo = new DirectoryInfo(fullPath).GetFiles("images/index_*.jpg");
                int dataContHeight = 0;
                imgHeight = new List<int>();
                if (imgInfo.Length > 0)
                {
                    this.imgNum = imgInfo.Length;
                    foreach (FileInfo img in imgInfo)
                    {
                        int imgh = System.Drawing.Image.FromFile(img.FullName).Height;
                        imgHeight.Add(imgh);
                        dataContHeight += imgh;
                    }
                }
                else
                {
                    this.imgNum = 1;
                    imgHeight.Add(300);
                    dataContHeight = 300;
                }                
                /*var _imgNum = root.Element("imgNum").Value;
                this.imgNum = int.Parse(_imgNum == "" ? "0" : _imgNum);
                var _imgHeight = root.Element("imgHeight").Value;
                this.imgHeight = int.Parse(_imgHeight == "" ? "0" : _imgHeight);
                var _lastImgHeight = root.Element("lastImgHeight").Value;
                this.lastImgHeight = int.Parse(_lastImgHeight == "" ? "0" : _lastImgHeight);
                var dataContHeight = this.imgHeight * (this.imgNum - 1) + this.lastImgHeight;*/
                var bgColor = root.Element("bgColor").Value;
                this.bgHeight = root.Element("bgHeight").Value;
                var bgURL = root.Element("bgURL").Value;
                var mainWidth = root.Element("mainWidth").Value;
                var soldOutY = root.Element("soldOutY").Value;
                var starTime = root.Element("starTime").Value;
                var endTime = root.Element("endTime").Value;
                var author = root.Element("author").Value;
                var childrenStyle = from c in root.Element("class").Nodes()
                                         select c;
                //标题关键词描述
                this.tkd = "<title>"+this.title+"- 广州广之旅官方网站</title><meta name=\"keywords\"  content=\""+this.keywords+",广之旅\"><meta name=\"Description\" content=\""+this.description+" -广之旅\">";
                //专题CSS
                this.defaultCss = "body{background:#" + bgColor + ";position:relative}.bgStyle{height:" + this.bgHeight + "px; background:url(images/" + bgURL + ") top center no-repeat}.bgBottomStyle{height:101px; background:url(images/bg_bottom_01.jpg) top center no-repeat;bottom:444px;*bottom:450px}.main_bg{width:" + mainWidth + "px}.dataCont{height:" + dataContHeight + "px}.link{ background:url(images/sprite.png) no-repeat 0 0}.line .soldOut{background-position:0 -" + soldOutY + "px}";
                //类对象CSS
                foreach (XElement childStyle in childrenStyle)
                {
                    if (childStyle.Name.ToString() == "remark")
                    {
                        var rs = from r in childStyle.Nodes()
                                 select r;
                        int rn = 0;
                        foreach (XElement r in rs)
                        {
                            this.childrenStyle += ".remark" + rn + printStyle(r);
                            rn++;
                        }
                        rn = 0;
                    }
                    else if (childStyle.Name.ToString() == "price") {
                        this.childrenStyle += "." + childStyle.Name.ToString() + printStyle(childStyle) + ".price em {font-size:"+childStyle.Element("yen-size").Value+"px}";
                    }
                    else {
                        this.childrenStyle += "." + childStyle.Name.ToString() + printStyle(childStyle);
                    }
                }
                //切片
                string index;
                for (int i = 0; i < imgInfo.Length; i++)
                {
                    index = (i < 9) ? ("0" + (i + 1).ToString()) : (i + 1).ToString();
                    //height = (i < (imgNum - 1)) ? _imgHeight : _lastImgHeight;
                    mainImgRepeater += "<div class=\"main\"><img src=\"/subject/" + this.fileName + "/images/index_" + index + ".jpg\" height=\"" + imgHeight.ElementAt(i) + "\"/></div>"; ;
                }
                //页脚
                this.footScript = "<script type=\"text/javascript\" src=\"/subject/js/foot_ad.js?" + starTime + "-" + endTime + "_" + author + "\"></script>";
            }
            catch (ArgumentException ex)
            {
                isSucess = false;
                exception = ex;
            }
        }
    }
    public static string printStyle(XElement e)
    {
        string styleString = "{";
        foreach (XElement styleElement in e.Nodes())
        {
            var name = styleElement.Name.ToString();
            switch (name)
            {
                case "width":
                    styleString += "width:" + e.Element("width").Value + "px";
                    break;
                case "height":
                    styleString += ";height:" + e.Element("height").Value + "px";
                    break;
                case "top":
                    styleString += ";top:" + e.Element("top").Value + "px";
                    break;
                case "left":
                    styleString += ";left:" + e.Element("left").Value + "px";
                    break;
                case "font-family":
                    styleString += ";font-family:\"" + e.Element("font-family").Value+"\"";
                    break;
                case "font-size":
                    styleString += ";font-size:" + e.Element("font-size").Value + "px";
                    break;
                case "font-weight":
                    styleString += ";font-weight:" + e.Element("font-weight").Value;
                    break;
                case "line-height":
                    styleString += ";line-height:" + e.Element("line-height").Value + "px";
                    break;
                case "color":
                    styleString += ";color:" + e.Element("color").Value;
                    break;
            }
        }
        styleString += "}";
        return styleString;
    }
    public class lineInfos{
        public string id;
        public string tplLineStyle;
        public string childString;
        public lineInfos(XElement _object,int i)
        {
            this.id = _object.Attribute("id").Value;
            var type = _object.Element("type").Value;
            var _class = _object.Element("class").Value;
            var content = "";
            var href="";
            switch (type)
            {
                case "lineContent":
                var width = _object.Element("width").Value;
                var height = _object.Element("height").Value;
                var top = _object.Element("top").Value;
                var left = _object.Element("left").Value;
                this.tplLineStyle = "#resizeDiv" + this.id + "{width:" + width + "px;height:" + height + "px;left:" + left + "px;top:" + top + "px}";
                this.childString += "<div id=\"resizeDiv" + this.id + "\" class=\"line posa object\"><div class=\"static\"><!-- {line#" + i + "} -->";
                var _childNode = _object.Element("childNode");
                if (_childNode.HasElements)
                {
                    int r = 0;
                    foreach (XElement child in _childNode.Nodes())
                    {
                        if (!Boolean.Parse(child.Attribute("object").Value))
                        {
                            switch (child.Name.ToString())
                            {
                                case "title":
                                    this.childString += "<h2 class=\"title posa inner\">{$title}</h2>";
                                    break;
                                case "price":
                                    this.childString += "<div class=\"price posa inner\"><em>&yen;</em>{$price}</div>";
                                    break;
                                case "link":
                                    this.childString += "<a href=\"{$link}\" class=\"link posa inner {$linkClass}\" target=\"{$linkTarget}\"></a>";
                                    break;
                                case "remark":
                                    this.childString += "<div class=\"remark remark" + r + " posa inner\">{$remark#" + r + "}</div>";
                                    r++;
                                    break;
                            }
                        }
                    }
                    r = 0;
                }
                this.childString += "<!-- {/line#" + i + "} --></div></div>";
                break;
                case "posaTextArea":
                content = Regex.Replace(_object.Element("content").Value,@"\n","<br/>");;
                this.childString += "<div id=\"resizeDiv" + this.id + "\" class=\"" + type + " posa object\">"+content+"</div>";
                this.tplLineStyle += "#resizeDiv" + this.id + printStyle(_object);
                break;
                case "posaLink":
                content = _object.Element("content").Value.Replace("\n", "<br/>");
                href = _object.Element("href").Value;
                this.childString += "<a href=\""+href+"\" target=\"_target\" id=\"resizeDiv" + this.id + "\" class=\"" + type + " posa object\">" + content + "</a>";
                this.tplLineStyle += "#resizeDiv" + this.id + printStyle(_object);
                break;
                case "posaUpdate":
                this.childString += "<div id=\"resizeDiv" + this.id + "\" class=\"" + type + " posa object\">{$update}</div>";
                this.tplLineStyle += "#resizeDiv" + this.id + printStyle(_object);
                break;
                case "cssLink":
                href = _object.Element("href").Value;
                this.childString += "<link id=\"" + this.id + "Link\" rel=\"stylesheet\" type=\"text/css\" href=\""+href+"\"/>";
                break;
                case "jsLink":
                href = _object.Element("href").Value;
                this.childString += "<script id=\"" + this.id + "Link\" type=\"text/javascript\" src=\"" + href + "\"></script>";
                break;
                case "posaDiv":
                var code = _object.Element("code").Value.Replace("[quot]","\"").Replace("[lt]","<").Replace("[gt]",">").Replace("[minus]","-");
                this.childString += "<div id=\"resizeDiv" + this.id + "\" class=\"" + type + " posa object\">" + code + "</div>";
                this.tplLineStyle += "#resizeDiv" + this.id + printStyle(_object);
                break;
            }
        }
    }
    public void ProcessRequest (HttpContext context) {
        context.Request.ContentEncoding = Encoding.GetEncoding("utf-8");
        context.Response.ContentEncoding = Encoding.GetEncoding("utf-8");
        string sourcePath = context.Server.MapPath("/subject/edit/spe/");
        string para = context.Request.Form["path"];
        //string fullPath = context.Server.MapPath("/subject/" + context.Request.Form["path"]);
        string FullNamePath=context.Server.MapPath("/subject/" + para );
        string xmlPath = context.Server.MapPath("/subject/" + para + "/datas/page.config.xml");
        string data_xmlPath = context.Server.MapPath("/subject/" + para + "/scripts/data.xml");
        try
        {
            var data = XDocument.Load(xmlPath);
            PageElement page = new PageElement(data, para, FullNamePath);
            var lines = from l in data.Descendants("object")
                          where l.Element("type").Value == "lineContent"
                          select l;
            var others = from o in data.Descendants("object")
                         where o.Element("type").Value != "lineContent" 
                        select o;
            //计算data.xml线路多少
            var data_line =XDocument.Load(data_xmlPath);
            int lineCount = data_line.Element("root").Elements("line").Count()-1;
            data_line = null;
            //打开tpl模板文本流
            string str = null;
            Encoding code = Encoding.GetEncoding("utf-8");
            str = ReadStream(sourcePath + "tpl/index.tpl", code);
            str = str.Replace("{$tplTitleKeyWordsDescription}", page.tkd);
            //生成mainCss
            string mianCss = null;
            mianCss = ReadStream(sourcePath + "css/main_style.css", code);
            str = str.Replace("{$tplMainStyleCss}", mianCss);
            //生成defualtCss
            str = str.Replace("{$tplDefualtCss}", page.defaultCss);
            //生成类对象Css
            str = str.Replace("{$tplChildrenStyle}", page.childrenStyle);
            //生成切片容器
            str = str.Replace("{$tplMainImgRepeater}", page.mainImgRepeater);
            //生成Object
            string tplStaticRepeater="";
            string tplLineStyle = "";
            int i = 0;
            foreach(XElement line in lines){//生成线路
                var lineInfos = new lineInfos(line,i);
                tplStaticRepeater += lineInfos.childString;
                tplLineStyle += lineInfos.tplLineStyle;
                i++;
            }
            foreach (XElement other in others)
            {//其他object
                var objectInfos = new lineInfos(other,0);
                tplStaticRepeater += objectInfos.childString;
                tplLineStyle += objectInfos.tplLineStyle;
            }
            data = null;
            //对象HTML
            str = str.Replace("{$tplStaticRepeater}", tplStaticRepeater);
            //对象CSS
            str = str.Replace("{$tplLineStyle}", tplLineStyle);
            //页脚JS
            str = str.Replace("{$tplFootScript}", page.footScript);
            //priceEditorAsst_改价4.0注释
            str = str.Replace("{$tplPEAScript}", "<script type=\"text/javascript\" src=\"/subject/js/priceEditorAsst.js?class=line&start=0&line=" + lineCount + "\"></script>");
            //保存，生成网页
            StreamWriter sw = null;
            try
            {
                sw = new StreamWriter(FullNamePath + "/templates/index.tpl", false, code);
                sw.Write(str);
                sw.Flush();
                context.Response.Write("True");
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                sw.Close();
            }
        }
        catch (Exception ex) {
            context.Response.Write(ex);
        }
    }
    private string ReadStream(string path, Encoding code)
    {
        string str = null;
        StreamReader sr = null;
        string file = new FileInfo(path).FullName;
        try
        {
            sr = new StreamReader(file, code);
            str = sr.ReadToEnd();
        }
        catch (Exception ex)
        {
            throw ex;
        }
        finally
        {
            sr.Close();
        }
        return str;
    }
    public bool IsReusable {
        get {
            return false;
        }
    }

}