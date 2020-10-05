# This "hook" is executed right before the site's pages are rendered
Jekyll::Hooks.register :site, :pre_render do |site|
  puts "Creating GP Markdown aliases..."
  require "rouge"

  class MoreGPLexer < Rouge::Lexers::Python
    title 'GP'
    aliases 'python', 'gp'
  end
end
