FROM ruby:3.1

# Install Jekyll and Bundler
RUN gem install jekyll bundler

# Set the working directory
WORKDIR /workspace

# Copy the Gemfile and Gemfile.lock
COPY Gemfile Gemfile.lock ./

# Install dependencies
RUN bundle install

# Expose port 4000
EXPOSE 4000

# Start Jekyll server
CMD ["bundle", "exec", "jekyll", "serve", "--host", "0.0.0.0"]

