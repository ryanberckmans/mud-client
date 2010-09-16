
fg = {"black" => "color: #000000;",
  "red" => "color: #cd0000;",
  "green" => "color: #00cd00;",
  "yellow" => "color: #cdcd00;",
  "blue" => "color: #0000ee;",
  "magenta" => "color: #cd00cd;",
  "cyan" => "color: #00cdcd;",
  "white" => "color: #e5e5e5;"}

fg_b = {"black" => "color: #7f7f7f; font-weight:bold; ",
  "red" => "color: #ff0000; font-weight:bold; ",
  "green" => "color: #00ff00; font-weight:bold; ",
  "yellow" => "color: #ffff00; font-weight:bold; ",
  "blue" => "color: #5c5cff; font-weight:bold; ",
  "magenta" => "color: #ff00ff; font-weight:bold; ",
  "cyan" => "color: #00ffff; font-weight:bold; ",
  "white" => "color: #ffffff; font-weight:bold; "}

bg = {"black_bg" => "background-color: #000000;",
  "red_bg" => "background-color: #cd0000;",
  "green_bg" => "background-color: #00cd00;",
  "yellow_bg" => "background-color: #cdcd00;",
  "blue_bg" => "background-color: #0000ee;",
  "magenta_bg" => "background-color: #cd00cd;",
  "cyan_bg" => "background-color: #00cdcd;",
  "white_bg" => "background-color: #e5e5e5;"}

bg_b = {"black_bg_b" => "background-color: #000000; ",
  "red_bg_b" => "background-color: #ff0000; ",
  "green_bg_b" => "background-color: #00ff00; ",
  "yellow_bg_b" => "background-color: #ffff00; ",
  "blue_bg_b" => "background-color: #5c5cff; ",
  "magenta_bg_b" => "background-color: #ff00ff; ",
  "cyan_bg_b" => "background-color: #00ffff; ",
  "white_bg_b" => "background-color: #ffffff; "}

fg.each_pair { |k,v|
  bg.each_pair { |k2,v2|
    puts ".tnc_#{k}_#{k2} { #{v} #{v2} }"
  }
}

fg_b.each_pair { |k,v|
  bg_b.each_pair { |k2,v2|
    puts ".tnc_#{k}_#{k2} { #{v} #{v2} }"
  }
}

