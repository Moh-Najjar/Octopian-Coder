# Octopian Coder

[![Build Status](https://img.shields.io/travis/username/AwesomeApp)](https://travis-ci.org/username/AwesomeApp)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is a code snippet for JavaScript. It is based on Ai API. It is plug and play, everything is hosted on CDN.

## Table of Contents
- [Installation](#installation)
- [Usage](#usage)
- [Complete Code](#complete-code)
- [Contact](#contact)

## Installation
Everything is hosted on CDN.

## Usage
Usage is simple, simply add  css: `<link href="css/clinical-coder.css" rel="stylesheet" />` in the `<head>` tag of your web page and add in the last of `<body>` tag `<script src="js/clinical-coder.min.js"></script>`.
See the code example below.

And finally initialize it by this script:
```
 GenerateClinicalCode({
     apiKey: "your-api-key",  // required: your api key
     theme: {
          themeColor: "#1e1c64", // optional
          textColor: "#ffffff", // optional
         },
     calbackResponse: function (response) {
         // write your code here to handle the response
             console.log(response);
         }
  });
```

## Complete Code
Here's an example of complete code:

```
<!DOCTYPE html>
<html>
<head>
    <title>Coder Demo</title>

    <meta charset="utf-8" />
    <link rel="shortcut icon" href="#">
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no,maximum-scale=1">

    <link href="css/clinical-coder.css" rel="stylesheet" />
</head>
<body>

    <div id="clinical-code">
    </div>

    <script src="js/clinical-coder.min.js"></script>

    <script>
        GenerateClinicalCode({
          apiKey: "your-api-key",  // required: your api key
          codeType: "ICD10AM", // required: code type
          theme: {
               themeColor: "#1e1c64", // optional
               textColor: "#ffffff", // optional
              },
          calbackResponse: function (response) {
              // write your code here to handle the response
                  console.log(response);
              }
         });
    </script>
</body>
</html>
```

## Contact
If you have any questions or feedback, feel free to reach out:
- Email: mohammad.najjar@octopian.com

